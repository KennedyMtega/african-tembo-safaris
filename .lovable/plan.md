

# Two-Step AI Image Generation: Prompt Engineering + Pro Model

## Overview
Change the image generation pipeline to a two-step process:
1. **Step 1** — Use `google/gemini-3-flash-preview` (text model) to craft a detailed, professional photography prompt from the user's simple input
2. **Step 2** — Use `google/gemini-3-pro-image-preview` (Banana Pro) to generate the image from that crafted prompt

This ensures every generated image has a rich, photography-grade prompt with camera angles, lens specs, lighting, composition, and thematic context — regardless of how simple the user's input was.

## Changes

### `supabase/functions/generate-gallery-image/index.ts` — Rewrite

**Step 1: Prompt creation** — Call `gemini-3-flash-preview` with a system prompt that instructs it to act as a professional photography prompt engineer. It takes the user's simple description and outputs a detailed prompt covering:
- Camera model and lens (e.g., "Canon EOS R5, 70-200mm f/2.8")
- Composition and angle (e.g., "low angle, rule of thirds")
- Lighting conditions (e.g., "golden hour backlight, rim lighting")
- Color palette and mood
- Environment and atmosphere details
- Post-processing style (e.g., "National Geographic editorial style")

**Step 2: Image generation** — Use the crafted prompt with `google/gemini-3-pro-image-preview` (Banana Pro) and `modalities: ["image", "text"]`.

Return both the generated image and the crafted prompt to the frontend (so admins can see what prompt was used).

### `src/pages/admin/AdminGallery.tsx` — Minor update
- Show the AI-crafted prompt below each generated image preview (small text) so admins see what was used
- No other changes needed; the function interface stays the same (`{ prompt } → { image, crafted_prompt }`)

### `src/pages/admin/AdminSettings.tsx` — No logic changes
- The hero generation already calls the same edge function, so it automatically benefits from the upgrade

## Technical Detail

The system prompt for Step 1 (prompt engineering) will be hardcoded in the edge function:

```
You are an expert photography prompt engineer. Given a subject description, 
create a single detailed image generation prompt. Include: camera model and lens, 
focal length, aperture, shooting angle, composition technique, lighting type and 
direction, color palette, mood/atmosphere, environment details, time of day, and 
post-processing style. Output ONLY the prompt text, nothing else.
```

No new files, no database changes, no new dependencies.

