

# Redesign About Page — Immersive Visual Layout with AI-Generated Imagery

## Current Problem
The About page is plain text-heavy with no imagery, no visual depth, and a flat layout. It needs immersive background imagery, section-supporting visuals, smooth scroll animations, and a premium minimalistic editorial feel — all without changing any of the existing copy.

## Design Approach
A full-bleed, section-based editorial layout inspired by premium safari/travel sites. Each major section gets its own visual treatment with parallax-style backgrounds, frosted glass overlays, and AI-generated supporting images. Smooth framer-motion scroll-triggered animations throughout.

## Section-by-Section Layout

### 1. Hero Banner — "Born from the Red Earth"
- Full-width hero with a blurred background image (reuse `hero-safari.jpg`)
- Dark gradient overlay with text centered vertically
- "Our Story" tag + h1 + intro paragraph rendered on top with frosted glass card
- Smooth fade-up on scroll entry

### 2. Tembo Philosophy — Three Pillars
- Alternating 2-column layout: image left / text right (or vice versa)
- Each pillar gets its own AI-generated image (3D-style safari elements):
  - "Deep Connection" — 3D render of hands cupping a glowing savanna landscape
  - "A Gentle Footprint" — 3D elephant footprint with ecosystem growing inside
  - "Unrivaled Expertise" — 3D binoculars overlooking a misty Serengeti dawn
- Images generated via `generate-gallery-image` edge function and stored in Supabase storage
- Staggered fade-in animations as each row enters viewport

### 3. Vision & Mission
- Full-width blurred background image (different safari scene)
- Two frosted-glass cards side by side on top
- Subtle parallax scroll effect on the background

### 4. Protecting the Giants — Conservation
- Three cards with AI-generated images as card headers:
  - "Low-Impact Travel" — eco-lodge in golden light
  - "Supporting Communities" — Maasai community scene
  - "Wildlife First" — close-up elephant eye
- Cards have image on top, icon + text below
- Scale-in animation on viewport entry

### 5. Meet the Founder
- Horizontal card with left side for a portrait placeholder (AI-generated professional portrait-style) and right side for quote text
- Warm gradient background behind the section

### 6. CTA — "The Wild Is Calling"
- Full-width background image with blur, dark overlay
- Centered text with a "Start Your Journey" button linking to `/packages`

## AI Image Generation Strategy
Create a new edge function call pattern in a utility component that:
1. Generates images on first load and caches URLs in localStorage
2. Falls back to placeholder.svg if generation fails
3. Uses `generate-gallery-image` with themed prompts emphasizing 3D elements and the safari brown/cream color palette

**Practical approach**: Since we can't guarantee edge function availability at render time, we'll create static placeholder images using the existing `hero-safari.jpg` with CSS blur/overlay treatments for backgrounds, and use hardcoded Unsplash URLs for section imagery (reliable, fast, free). This ensures the page always looks great without depending on AI generation at runtime.

**Image sources** (royalty-free Unsplash, safari-themed):
- Hero bg: reuse `hero-safari.jpg`
- Philosophy images: 3 distinct safari Unsplash URLs
- Vision/Mission bg: separate safari landscape
- Conservation cards: 3 wildlife/community Unsplash URLs
- Founder section: savanna portrait-style backdrop

## Animation Details (framer-motion)
- Hero: fade-in + slight scale on load
- Philosophy rows: staggered slide-in from alternating sides (left/right)
- Vision/Mission cards: fade-up with 0.1s stagger
- Conservation cards: scale-in with stagger
- Founder: slide-in from bottom
- CTA: fade-in
- All use `viewport={{ once: true, margin: "-100px" }}` for smooth trigger

## Technical Implementation

### Files Changed

| File | Change |
|------|--------|
| `src/pages/AboutPage.tsx` | Complete redesign — same text, new immersive visual layout with background images, frosted glass sections, alternating image+text rows, scroll animations |

### Key Implementation Details
- All images use `onError` fallback to `/placeholder.svg`
- Backgrounds use `object-cover` + CSS `backdrop-blur` overlays
- Glass effect: `bg-background/70 backdrop-blur-md`
- Responsive: single column on mobile, multi-column on desktop
- No new dependencies needed (framer-motion already installed)
- Max-width sections alternate between `max-w-6xl` (full) and `max-w-4xl` (text)
- Images lazy-loaded with `loading="lazy"`

