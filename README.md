# African Tembo Safari

A full-stack safari booking platform for authentic Tanzanian wildlife experiences. Built with React, Supabase, and AI-powered features.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **AI**: Supabase Edge Functions with AI gateway for chatbot, image generation, recommendations

## Features

### Public Site
- Browse 5 curated safari packages (Serengeti Migration, Ngorongoro Cultural, Zanzibar Beach, Kilimanjaro Trek, Northern Circuit Grand Safari)
- Destination pages with detailed itineraries, highlights, inclusions/exclusions
- Photo gallery with AI-generated and uploaded images
- Booking flow with 50% deposit payment system
- AI-powered chatbot for visitor questions
- Responsive design for all devices
- FAQ, About, Contact, Privacy, and Terms pages

### Customer Portal
- Dashboard with booking overview
- Booking history and status tracking
- Wishlist for saved packages
- Profile management

### Admin Panel
- **Dashboard**: Key metrics, recent bookings, activity overview
- **Analytics**: Revenue charts, booking trends, visitor insights
- **Packages**: Full CRUD with itinerary builder, image management
- **Bookings**: List view + calendar view, status management
- **Payments**: Payment tracking and status updates
- **Users**: User management with role-based access (admin, management, user)
- **CRM**: Contact management, interaction tracking, tags
- **Gallery**: Image upload + AI image generation (via edge function)
- **Knowledge Base**: Article management with AI assistant for content generation and document processing
- **Reviews**: Moderation with approve/reject/feature workflow
- **Inquiries**: Priority-based inquiry management
- **Reports**: Exportable business reports
- **Activity Log**: Audit trail of admin actions
- **Settings**: Company profile, team management, hero section config, AI configuration, social media links

## Supabase Edge Functions

| Function | Purpose |
|----------|---------|
| `ai-chat` | AI chatbot for visitor questions |
| `generate-gallery-image` | AI image generation for gallery and hero |
| `kb-assistant` | Knowledge base article generation and document processing |
| `recommendation-engine` | Package recommendations based on preferences |
| `booking-notification` | Email notifications for booking events |
| `review-notification` | Notifications for new reviews |
| `create-employee` | Admin user creation with role assignment |

## Getting Started

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key |

## Project Structure

```
src/
├── components/       # Reusable UI components (Navbar, Footer, ChatWidget, etc.)
├── contexts/         # React contexts (AuthContext)
├── hooks/            # Custom hooks
├── pages/
│   ├── admin/        # Admin panel pages
│   ├── auth/         # Authentication pages
│   └── customer/     # Customer portal pages
├── services/         # Supabase data access layer
├── types/            # TypeScript type definitions
└── integrations/     # Supabase client configuration

supabase/
├── functions/        # Edge functions (AI chat, image gen, notifications)
└── migrations/       # Database schema migrations
```

## Database Tables

`packages`, `package_itinerary`, `destinations`, `bookings`, `booking_travelers`, `payments`, `profiles`, `user_roles`, `reviews`, `gallery_items`, `inquiries`, `knowledge_base`, `crm_contacts`, `crm_interactions`, `chat_conversations`, `chat_messages`, `notifications`, `activity_log`, `wishlists`, `site_settings`
