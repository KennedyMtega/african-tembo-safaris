
# Phase: Hero Media Management, Gallery, AI Chatbot, CRM, and Admin Login Fix

This is a large feature set split into logical groups. Each group builds on the previous.

---

## 1. Fix Admin Login Routing (Quick Fix)

**Problem**: When an admin/employee logs in via `/admin`, they get routed like a customer. Also when logging in via `/login`, admins aren't redirected to the admin dashboard.

**Solution**:
- `AdminLogin.tsx`: After successful sign-in, wait for the role to be fetched, then navigate to `/admin/dashboard`
- `LoginPage.tsx`: After sign-in, check the user's role. If admin or management, redirect to `/admin/dashboard` instead of `/dashboard`
- `AuthContext.tsx`: Make `signIn` return the role so callers can route immediately, or add a `waitForRole` helper

**Files modified**: `src/pages/admin/AdminLogin.tsx`, `src/pages/auth/LoginPage.tsx`, `src/contexts/AuthContext.tsx`

---

## 2. Hero Media Management in Settings

**Database**: Create a `site_settings` table to persist hero images/videos and other site config:
```text
site_settings (
  id uuid PK default gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz default now()
)
```
RLS: Admin can SELECT/INSERT/UPDATE/DELETE. Public can SELECT.

**Storage**: Create a `site-media` storage bucket (public) for hero images and videos.

**Settings UI**: Add a "Hero Section" card in `AdminSettings.tsx` with:
- Upload hero image (file picker, preview)
- Upload hero video (file picker, preview thumbnail)
- Toggle between image/video mode
- Save to `site_settings` table with key `hero_media`

**Homepage**: Update `HomePage.tsx` to fetch hero media from `site_settings` instead of the static import. Support both image and video (HTML5 `<video>` tag with autoplay, muted, loop).

**Files created/modified**: Migration SQL, `src/pages/admin/AdminSettings.tsx`, `src/pages/HomePage.tsx`

---

## 3. Public Gallery Page (`/gallery`)

**Database**: Create a `gallery_items` table:
```text
gallery_items (
  id uuid PK,
  title text,
  type text NOT NULL ('image' | 'video'),
  url text NOT NULL,
  thumbnail_url text,
  sort_order integer default 0,
  created_at timestamptz default now()
)
```
RLS: Public SELECT, Admin full access, Management INSERT/UPDATE/SELECT.

**Storage**: Reuse `site-media` bucket for gallery uploads.

**Admin UI**: Add a "Gallery" link in the admin sidebar under Operations. Create `AdminGallery.tsx` with upload interface for images/videos (file upload, not URL), drag-to-reorder, delete.

**Public Page**: Create `GalleryPage.tsx` at `/gallery`:
- Randomized masonry grid of images
- Lightweight animations using framer-motion (staggered fade-in, hover zoom)
- Video items displayed as overlapping cards with autoplay (muted, loop)
- All media served from Supabase Storage (already optimized on upload via browser-side compression before upload using canvas resize for images)
- Lazy loading with intersection observer for performance

**Files created**: `src/pages/GalleryPage.tsx`, `src/pages/admin/AdminGallery.tsx`, migration SQL
**Files modified**: `src/App.tsx` (add route), `src/components/AdminSidebar.tsx` (add link), `src/components/Navbar.tsx` (add public nav link)

---

## 4. AI Chatbot with Knowledge Base (Bring Your Own API Keys)

### 4a. API Key Storage in Settings

Add an "AI Configuration" card in `AdminSettings.tsx`:
- Input field for Claude API key (masked, stored as Supabase secret via edge function)
- Input field for Gemini API key (masked, stored similarly)
- Toggle for which provider to use as primary
- Keys stored in `site_settings` table (encrypted values) with keys `ai_claude_key` and `ai_gemini_key`

### 4b. Knowledge Base

**Database**: Create a `knowledge_base` table:
```text
knowledge_base (
  id uuid PK,
  title text NOT NULL,
  content text NOT NULL,
  category text,
  tags text[],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)
```
RLS: Admin/Management can CRUD. Public can SELECT.

**Admin UI**: Create `AdminKnowledgeBase.tsx` page:
- List all knowledge articles with search/filter
- Create/edit articles with title, content (textarea), category, tags
- Bulk import option

**Sidebar**: Add "Knowledge Base" under Operations in admin sidebar.

### 4c. Chat Edge Function

Create `supabase/functions/ai-chat/index.ts`:
- Accepts POST with `{ message, conversationId?, userId?, visitorName?, visitorEmail? }`
- Fetches API keys from `site_settings`
- Queries `knowledge_base` for relevant articles (keyword match on the message)
- Builds a system prompt that strictly constrains the AI to only use internal knowledge base content
- Includes user profile info if logged in (name, booking history, preferences)
- For visitors: collects name/email and saves to `chat_leads` table (CRM)
- Supports both Claude and Gemini APIs based on admin's selected provider
- Returns streamed response

**System prompt rules**:
- Only answer from knowledge base content
- Know the user's name and preferences if logged in
- For visitors, politely collect name and email
- Never fabricate information outside the knowledge base

### 4d. Chat UI Component

Create `src/components/ChatWidget.tsx`:
- Floating button (bottom-right corner) on all public pages
- Expandable chat panel with message history
- Works for both logged-in users and visitors
- For visitors: asks for name/email on first message
- Fast, lightweight overlay -- not a full page
- Stores conversation in local state (and optionally in a `chat_conversations` table)

### 4e. Chat Tables

```text
chat_conversations (
  id uuid PK,
  user_id uuid nullable,
  visitor_name text,
  visitor_email text,
  created_at timestamptz default now()
)

chat_messages (
  id uuid PK,
  conversation_id uuid FK -> chat_conversations,
  role text NOT NULL ('user' | 'assistant'),
  content text NOT NULL,
  created_at timestamptz default now()
)
```

**Files created**: `supabase/functions/ai-chat/index.ts`, `src/components/ChatWidget.tsx`, `src/pages/admin/AdminKnowledgeBase.tsx`, migration SQL
**Files modified**: `src/App.tsx`, `src/components/PublicLayout.tsx`, `src/components/AdminSidebar.tsx`, `src/pages/admin/AdminSettings.tsx`, `supabase/config.toml`

---

## 5. CRM Expansion

### 5a. CRM Database

Create a `crm_contacts` table:
```text
crm_contacts (
  id uuid PK,
  user_id uuid nullable,
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  source text ('chat', 'inquiry', 'booking', 'manual'),
  status text ('lead', 'prospect', 'customer', 'inactive'),
  notes text,
  tags text[],
  last_interaction timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
)

crm_interactions (
  id uuid PK,
  contact_id uuid FK -> crm_contacts,
  type text ('chat', 'inquiry', 'booking', 'note', 'email'),
  summary text,
  created_at timestamptz default now()
)
```
RLS: Admin/Management SELECT, INSERT, UPDATE. Admin DELETE.

### 5b. CRM Admin Page

Create `src/pages/admin/AdminCRM.tsx` -- a full, intensive page (not an overlay):
- **Header KPIs**: Total contacts, new leads this month, conversion rate, active customers
- **Contact table** with search, filter by status/source/tags, sortable columns
- **Contact detail panel** (side sheet or dedicated view): Full profile, interaction timeline, linked bookings, chat history, notes
- **Lead pipeline view**: Kanban-style columns (Lead -> Prospect -> Customer -> Inactive)
- **Bulk actions**: Tag, change status, export
- **Auto-capture**: When chat widget collects visitor info, auto-create CRM contact
- **Auto-link**: When inquiries come in, create/update CRM contact
- **Auto-link**: When bookings are made, create/update CRM contact

### 5c. CRM Service

Create `src/services/crmService.ts`:
- CRUD for contacts and interactions
- `findOrCreateByEmail(email, name, source)` method
- Integration points called from booking, inquiry, and chat services

**Files created**: `src/pages/admin/AdminCRM.tsx`, `src/services/crmService.ts`, migration SQL
**Files modified**: `src/App.tsx`, `src/components/AdminSidebar.tsx`, `src/services/bookingService.ts`, `src/services/inquiryService.ts`

---

## 6. Files Summary

### New Files (12+)
- Migration SQL for `site_settings`, `gallery_items`, `knowledge_base`, `chat_conversations`, `chat_messages`, `crm_contacts`, `crm_interactions`, `site-media` bucket
- `supabase/functions/ai-chat/index.ts`
- `src/pages/GalleryPage.tsx`
- `src/pages/admin/AdminGallery.tsx`
- `src/pages/admin/AdminKnowledgeBase.tsx`
- `src/pages/admin/AdminCRM.tsx`
- `src/components/ChatWidget.tsx`
- `src/services/crmService.ts`

### Modified Files (10+)
- `src/pages/admin/AdminLogin.tsx` -- role-aware redirect
- `src/pages/auth/LoginPage.tsx` -- role-aware redirect
- `src/contexts/AuthContext.tsx` -- signIn returns role
- `src/pages/admin/AdminSettings.tsx` -- hero media + AI keys sections
- `src/pages/HomePage.tsx` -- dynamic hero from DB
- `src/App.tsx` -- new routes
- `src/components/AdminSidebar.tsx` -- Gallery, Knowledge Base, CRM links
- `src/components/PublicLayout.tsx` -- ChatWidget
- `src/components/Navbar.tsx` -- Gallery nav link
- `supabase/config.toml` -- ai-chat function
- `src/services/bookingService.ts` -- CRM integration
- `src/services/inquiryService.ts` -- CRM integration

---

## Technical Notes

- AI API keys are stored in `site_settings` (not Supabase secrets) so admins can update them from the UI without needing Supabase dashboard access
- The AI chat edge function reads the keys from DB at runtime
- Gallery images are compressed client-side before upload (canvas resize to max 1920px width, JPEG quality 0.8) to keep files lightweight without quality loss
- Videos are uploaded as-is (browser-side video compression is not practical) but limited to 50MB max
- The chat widget uses non-streaming responses initially for simplicity; streaming can be added later
- CRM auto-capture happens in the edge functions (chat, booking notification) using the service role key
