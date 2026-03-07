

# Fix Gallery & Image Visibility Issues

## Problem

1. **Gallery is empty** — the `gallery_items` table has 0 rows. AI-generated images were saved to `site-media` storage for the hero section, but were never inserted into `gallery_items`. The admin gallery and public gallery both show "No gallery items yet."

2. **Hero image works** — the `hero_media` site setting correctly points to a Supabase storage URL (`site-media/hero/ai-1772588544331.png`), so the hero section should be displaying fine. If it's not showing, it may be a storage RLS/public bucket issue (the bucket is public, so this should work).

3. **No seeded gallery content** — the system relies entirely on manual uploads or AI generation + "Add to Gallery" clicks. There's no auto-population.

## Root Cause

The gallery was set up correctly in code, but no images were ever saved to the `gallery_items` table. The AI generation flow in `AdminGallery.tsx` works (generate → click "Add to Gallery" → upload to storage → insert into `gallery_items`), but the user hasn't gone through that flow yet. The hero AI images went to `site_settings` not `gallery_items`.

## Plan

### 1. Seed gallery with existing package images (SQL INSERT)

Use the package images (which are already working Unsplash URLs) to populate `gallery_items` so both admin and public galleries have content immediately. Insert ~15 images from the 5 packages with descriptive titles.

### 2. Also seed the two AI-generated hero images into the gallery

The two images in `site-media` storage (`hero/ai-1772588544331.png` and `hero/ai-1772588541993.png`) should also be inserted into `gallery_items` so they appear in the gallery.

### 3. Add `onError` fallback to gallery image tags

Update `GalleryPage.tsx` and `AdminGallery.tsx` img tags with `onError` fallback to `/placeholder.svg` to prevent broken images in the future.

### 4. Invalidate both gallery query keys

Ensure `admin-gallery` and `gallery-public` query keys stay in sync by invalidating both when changes are made in `AdminGallery.tsx`.

## Files Changed

| File | Change |
|------|--------|
| SQL (insert tool) | Insert ~17 rows into `gallery_items` using package images + storage hero images |
| `src/pages/GalleryPage.tsx` | Add `onError` fallback to img tags |
| `src/pages/admin/AdminGallery.tsx` | Add `onError` fallback, invalidate both query keys on changes |

