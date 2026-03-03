

# Knowledge Base Upgrade: Better UI + AI Assistant Integration

## Overview
Transform the Knowledge Base admin page from a basic dialog-based form into a rich, full-featured content management experience with an integrated AI writing assistant that helps admins create, improve, and auto-generate knowledge base articles.

## What Changes

### 1. Redesigned Article Editor (Full-Page Panel)
Replace the small cramped dialog with a proper side-by-side layout:
- **Left panel**: Article list with search, filters by category, and article cards
- **Right panel**: Full article editor that slides in when creating/editing, with proper spacing, a rich content area, live preview, and category/tag pickers
- Add a confirmation dialog before deleting articles
- Show article stats (word count, last updated, category)

### 2. AI Writing Assistant Panel
Add an AI-powered assistant built into the KB editor that helps admins:
- **"Generate Article"** - Type a topic/prompt and the AI generates a full KB article (title, content, category, tags)
- **"Improve Content"** - Select existing content and the AI rewrites/expands it
- **"Suggest Topics"** - AI analyzes existing KB articles and suggests missing topics the business should cover (e.g., "You don't have articles about visa requirements" or "Consider adding cancellation policy info")
- The assistant appears as an inline chat/toolbar within the editor

### 3. New Edge Function: `kb-assistant`
A dedicated edge function that handles KB-specific AI tasks:
- Uses the same AI provider config (Claude/Gemini keys from `site_settings`) as the existing `ai-chat` function
- Accepts an `action` parameter: `generate`, `improve`, or `suggest`
- For `generate`: takes a topic prompt, returns structured article data
- For `improve`: takes existing content, returns enhanced version
- For `suggest`: fetches all existing KB articles and identifies gaps, returning topic suggestions
- The AI can also directly save articles to the `knowledge_base` table (via the edge function with service role key)

### 4. Config & Infrastructure
- Add `[functions.kb-assistant]` with `verify_jwt = false` to `supabase/config.toml`
- No new database tables needed -- uses existing `knowledge_base` table and `site_settings` for AI keys

## Technical Details

### Files to Create
- **`supabase/functions/kb-assistant/index.ts`** - Edge function with three action modes (generate, improve, suggest). Reads AI keys from `site_settings`, calls Claude/Gemini, and optionally inserts articles directly into `knowledge_base`.

### Files to Modify
- **`src/pages/admin/AdminKnowledgeBase.tsx`** - Complete rewrite with:
  - Two-column responsive layout (article list + editor/AI panel)
  - Tabbed interface in editor: "Write" and "AI Assistant"
  - AI Assistant tab with action buttons (Generate, Improve, Suggest Topics)
  - Category filter chips above article list
  - Delete confirmation with AlertDialog
  - Better card design with timestamps and word counts
- **`supabase/config.toml`** - Add `kb-assistant` function entry

### AI Assistant UX Flow
1. Admin clicks "Add Article" -- right panel opens with editor
2. Admin can either write manually OR switch to "AI Assistant" tab
3. In AI tab, admin types "Write an article about our cancellation policy" and clicks Generate
4. AI returns structured content that auto-fills the title, content, category, and tags fields
5. Admin reviews, tweaks if needed, and clicks Save
6. "Suggest Topics" button shows a list of recommended articles to add based on what's missing
7. "Improve" button takes current content and returns an enhanced version

