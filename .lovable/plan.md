

# Settings Restructure, Gallery AI Images, and KB Document Upload

## Overview
Four main changes: (1) Split the Settings page into tabbed sub-sections, (2) Generate AI images for the gallery, (3) Add document upload to the Knowledge Base AI assistant.

---

## 1. Settings Page — Tabbed Layout

**File: `src/pages/admin/AdminSettings.tsx`**

Replace the single scrolling page with a horizontal tab navigation at the top. Each section gets its own tab:

- **Company Profile** — Company name, email, phone, address, system (currency/timezone), notifications
- **Team Management** — Employee list, invite dialog, role management
- **Hero Section** — Hero media mode toggle, image/video upload, save (keep all existing upload functionality intact)
- **AI Configuration** — Provider selection, API keys
- **Social Media** — Social links form

Each tab renders only its own content, eliminating the endless scroll. All existing state and logic remains the same, just reorganized into `TabsContent` blocks using the existing Radix Tabs component.

---

## 2. Gallery — AI-Generated Images

**File: `src/pages/admin/AdminGallery.tsx`**

Add a "Generate with AI" section alongside the existing upload form:
- Text prompt input (e.g., "African elephant at sunset in the Serengeti")
- "Generate" button that calls a new edge function
- Shows 3 generated image previews the admin can select from
- Selected images get uploaded to the `site-media` bucket and saved to `gallery_items` table
- Existing manual upload remains untouched

**File: `supabase/functions/generate-gallery-image/index.ts`** (new)

Edge function that:
- Takes a prompt string
- Calls Lovable AI Gateway with `google/gemini-2.5-flash-image` model and `modalities: ["image", "text"]`
- Returns base64 image data
- Called 3 times (or 3 prompts with variations) to produce 3 options
- The frontend uploads the selected base64 image to Supabase storage

**File: `supabase/config.toml`** — Add `[functions.generate-gallery-image]` with `verify_jwt = false`

The gallery items are already visible on the public `/gallery` page via `galleryService.getAll()` with the existing `Public read gallery` RLS policy, so no changes needed there.

---

## 3. Hero Section — Design Presets

Within the Hero Section tab in settings, add a "Generate Hero Designs" feature:
- Button to generate 3 AI hero images with safari-themed prompts
- Shows 3 preview cards the admin can click to select
- Selecting one sets it as `heroImageUrl` (same flow as current upload)
- The existing upload functionality (image and video) remains fully intact alongside this

Uses the same `generate-gallery-image` edge function with different prompts.

---

## 4. Knowledge Base — Document Upload + AI Processing

**File: `src/pages/admin/AdminKnowledgeBase.tsx`**

Add a new section in the AI Assistant tab:
- **"Upload Document"** card with a file input (accepts `.txt`, `.md`, `.pdf`, `.docx`)
- On upload, reads the file content client-side (for text files via FileReader; for PDF/DOCX, extracts text client-side or sends raw to edge function)
- Sends the extracted text to the existing `kb-assistant` edge function with action `"generate"` and the document content as the prompt
- AI processes the document, structures it into a proper KB article (title, content, category, tags)
- Auto-fills the editor form fields
- Admin reviews and clicks Save

**File: `supabase/functions/kb-assistant/index.ts`**

Add a new action `"from_document"`:
- Receives raw document text
- System prompt instructs AI to extract key information, organize it into a well-structured KB article
- Improve and clean up content only when necessary (as requested)
- Returns structured article data via the same `save_article` tool call pattern

---

## Technical Summary

| File | Action |
|------|--------|
| `src/pages/admin/AdminSettings.tsx` | Restructure into 5 tabs |
| `src/pages/admin/AdminGallery.tsx` | Add AI image generation UI |
| `src/pages/admin/AdminKnowledgeBase.tsx` | Add document upload in AI tab |
| `supabase/functions/generate-gallery-image/index.ts` | New — AI image generation |
| `supabase/functions/kb-assistant/index.ts` | Add `from_document` action |
| `supabase/config.toml` | Add new function entry |

No database changes needed — all existing tables and RLS policies support these features.

