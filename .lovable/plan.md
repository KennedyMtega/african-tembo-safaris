

# Fix Gallery Title Handling for Uploads and AI Images

## Problem
1. When uploading images without entering a title, they get `null` titles and display as "Untitled" in the admin gallery
2. When uploading multiple files, all get the same title from the single input field
3. AI-generated images correctly use the prompt as title, but the title field in the upload section doesn't reset per-file

## Solution

### Changes to `src/pages/admin/AdminGallery.tsx`

**Auto-generate titles from filenames when no title is provided:**
- When the title input is empty, derive a title from the uploaded file's name by stripping the extension and replacing hyphens/underscores with spaces, then capitalizing
- Example: `serengeti-sunset-2024.jpg` becomes `Serengeti Sunset 2024`

**For multi-file uploads, append a number if more than one file:**
- If uploading 3 files with title "Safari", they become "Safari 1", "Safari 2", "Safari 3"
- If no title provided, each gets its own filename-derived title

**Keep AI-generated image title logic as-is** (uses `aiPrompt.slice(0, 100)`) since it already works correctly.

### File Changes

| File | Change |
|------|--------|
| `src/pages/admin/AdminGallery.tsx` | Update `handleUpload` to auto-generate titles from filenames when title input is empty; number multi-file uploads when a title is provided |

