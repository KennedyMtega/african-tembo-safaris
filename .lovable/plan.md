

# Favicon, Remove Lovable Branding, Rewrite README

## 1. Use Tembo Logo as Browser Favicon

The existing logo is at `src/assets/tembo-logo.jpg`. Since it's a JPG in the `src/` directory, we need to copy it to `public/` and reference it in `index.html` as the favicon. The current favicon is `public/favicon.ico` (the default Lovable icon).

**Change:** Update `index.html` to use the Tembo logo as favicon by adding a `<link rel="icon">` pointing to the logo file. We'll copy the logo to `public/favicon.jpg` and reference it.

## 2. Remove All Public-Facing Lovable References

Only `index.html` has visible Lovable branding. The edge functions use `LOVABLE_API_KEY` internally — those are backend-only and not visible to users, so they stay.

**Changes to `index.html`:**
- Title: `"Lovable App"` → `"African Tembo Safari | Authentic Tanzania Safari Experiences"`
- Description: `"Lovable Generated Project"` → `"Curated safari experiences through Tanzania's most iconic wildlife destinations. Serengeti, Ngorongoro, Kilimanjaro, Zanzibar and more."`
- Author: `"Lovable"` → `"African Tembo Safari"`
- og:title, og:description: Update to match
- og:image, twitter:image: Remove the Lovable opengraph URLs (set to empty or remove)
- twitter:site: Remove `@Lovable`
- Remove TODO comments

## 3. Rewrite README with Project Knowledge

Replace the entire README with comprehensive documentation covering:

- **Project name & description**: African Tembo Safari — a full-stack safari booking platform
- **Tech stack**: React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Supabase (auth, database, storage, edge functions)
- **Features overview**:
  - Public site: Package browsing, destination pages, gallery, booking flow with 50% deposit, AI chatbot, responsive design
  - Customer portal: Dashboard, bookings, wishlist, profile
  - Admin panel: Dashboard, analytics, package CRUD, booking management + calendar view, user management, payments, CRM, gallery (AI image generation), knowledge base, reviews, inquiries, reports, activity log, settings
- **Safari packages**: 5 Tanzanian packages (Serengeti Migration, Ngorongoro Cultural, Zanzibar Beach, Kilimanjaro Trek, Northern Circuit Grand Safari)
- **Key integrations**: Supabase auth, storage, edge functions (AI chat, image generation, booking notifications, recommendation engine)
- **Getting started**: Clone, install, run
- **Environment variables**: Supabase URL/key needed
- **Project structure**: Brief overview of `src/pages`, `src/services`, `src/components`, `supabase/functions`

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Replace all Lovable branding with African Tembo Safari metadata, add favicon link |
| `public/favicon.jpg` | Copy from `src/assets/tembo-logo.jpg` |
| `README.md` | Complete rewrite with project documentation |

