

# OG Image Generation, SEO Enhancement, and Gallery Title Editing

## 1. Generate OG Social Share Image

Use the `generate-gallery-image` edge function to create a branded OG image, then upload it to `site-media` storage and reference it in `index.html`.

**Approach:** Create a new edge function call via the existing `generate-gallery-image` function with a safari-branded prompt. Upload the resulting image to `site-media/og/og-image.png`. Then hardcode the public URL in `index.html`.

Since we can't call the edge function during build, we'll generate the image by creating a simple admin action, but more practically: we'll use a high-quality Unsplash image as the OG image (reliable, always available) and upload it to storage via a migration-time approach. Actually, the simplest approach: reference the hero safari image already in the project (`src/assets/hero-safari.jpg`) by copying it to `public/og-image.jpg` and referencing it with a full URL pattern in the metadata.

**Files:** `public/og-image.jpg` (copy from hero-safari.jpg), `index.html`

## 2. Comprehensive SEO Metadata in `index.html`

Add extensive metadata:
- `og:url`, `og:site_name`, `og:locale`, `og:image` with dimensions
- `twitter:title`, `twitter:description`, `twitter:image`
- Structured data (JSON-LD) for `TravelAgency` schema
- Additional meta: `robots`, `keywords`, `theme-color`, `canonical` (relative)
- `geo.region`, `geo.placename` for Tanzania
- Apple touch icon

## 3. SEO Component for Per-Page Metadata

Create a reusable `SEOHead` component using `document.title` and meta tag manipulation for key pages (packages, destinations, about, etc.) so each page has unique title/description for better indexing.

**Files:** `src/components/SEOHead.tsx`, update key pages to use it

## 4. Sitemap and robots.txt Enhancement

Update `robots.txt` to include sitemap reference. Create a static `public/sitemap.xml` with all known routes.

**Files:** `public/robots.txt`, `public/sitemap.xml`

## 5. Gallery Title Editing in Admin

Add inline editing capability to gallery items in `AdminGallery.tsx`:
- Each gallery card gets a pencil/edit icon next to the title
- Clicking it shows an inline input field to rename
- Save updates the `gallery_items` table via a new `galleryService.updateTitle()` method

**Files:** `src/pages/admin/AdminGallery.tsx`, `src/services/galleryService.ts`

## Summary of All File Changes

| File | Change |
|------|--------|
| `public/og-image.jpg` | Copy from hero-safari.jpg as OG share image |
| `index.html` | Full SEO metadata: OG, Twitter, JSON-LD structured data, geo, keywords, theme-color |
| `public/robots.txt` | Add sitemap reference |
| `public/sitemap.xml` | Static sitemap with all public routes |
| `src/components/SEOHead.tsx` | New reusable component for per-page title/meta |
| `src/pages/HomePage.tsx` | Add SEOHead |
| `src/pages/PackagesPage.tsx` | Add SEOHead |
| `src/pages/AboutPage.tsx` | Add SEOHead |
| `src/pages/ContactPage.tsx` | Add SEOHead |
| `src/pages/DestinationsPage.tsx` | Add SEOHead |
| `src/pages/GalleryPage.tsx` | Add SEOHead |
| `src/pages/PackageDetailPage.tsx` | Add dynamic SEOHead with package title |
| `src/pages/admin/AdminGallery.tsx` | Add inline title editing for gallery items |
| `src/services/galleryService.ts` | Add `updateTitle()` method |

