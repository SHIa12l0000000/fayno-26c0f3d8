# FAYNO — Family Story Keeper

A production-ready platform for preserving family history with privacy controls, beautiful design, and seamless sharing.

## Features

### Core Features
- **Family Tree Management** - Add and manage family members with relationships, birth/death years, villages, and occupations
- **Story Preservation** - Write and save stories about each family member to preserve family history
- **Photo Preservation** - Upload and organize family photographs alongside records
- **Privacy Controls** - Three-tier privacy system: Public (searchable), Family Only (FAYNO members), and Private (you only)
- **Public Search** - Browse and search public family records by name or village
- **User Profiles** - Customizable public profile with username and bio
- **Authentication** - Email/password and Google OAuth authentication with Supabase

### Design System
- **Color Palette**: Green (#22C55E) primary, with neutral whites and grays
- **Typography**: Inter font family for clean, modern appearance
- **Components**: shadcn/ui with Tailwind CSS for consistent UI
- **Responsiveness**: Mobile-first design that scales beautifully to desktop

## Project Structure

```
src/
├── routes/                    # TanStack Router file-based routes
│   ├── index.tsx             # Landing page with family diagram
│   ├── auth.tsx              # Authentication (login/signup/forgot password)
│   ├── search.tsx            # Public search for families and members
│   ├── $username.tsx         # Public user profiles
│   └── _authenticated/       # Protected routes (require login)
│       ├── dashboard.tsx     # User dashboard with stats
│       ├── profile.tsx       # User profile settings
│       ├── onboarding.tsx    # First-time user setup
│       └── family/           # Family management
│           ├── index.tsx     # My family list
│           ├── new.tsx       # Add new member
│           └── $id/          # Member detail pages
├── components/
│   ├── site/                 # Page-level components
│   │   ├── Navbar.tsx        # Navigation with logo
│   │   ├── Footer.tsx        # Footer
│   │   └── PageShell.tsx     # Layout wrapper
│   ├── ui/                   # shadcn/ui components
│   └── MemberForm.tsx        # Reusable family member form
├── lib/
│   ├── auth.tsx              # Authentication context and hooks
│   ├── family.ts             # Family data types and utilities
│   └── photos.ts             # Photo upload management
└── styles.css                # Global styles and design tokens

```

## Key Technologies

- **Framework**: TanStack Start (React meta-framework)
- **Styling**: Tailwind CSS v4 with custom design tokens
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + Lovable Cloud Auth
- **State**: TanStack Query for data fetching and caching
- **Routing**: TanStack Router
- **UI Components**: shadcn/ui
- **Icons**: Lucide React

## Data Model

### Profiles Table
- `id`, `user_id` (auth)
- `username` (unique, 3-20 chars)
- `full_name`
- `profile_photo` (URL path)
- `created_at`

### Family Members Table
- `id`, `user_id` (FK to profiles)
- `full_name`, `relation`
- `birth_year`, `death_year`
- `village`, `city`
- `father_name`, `mother_name`
- `occupation`
- `about` (story/biography)
- `photo` (URL path)
- `privacy` (public | family | private)
- `created_at`

## Privacy Levels

- **Public**: Visible in search, on public profiles, anyone can find
- **Family**: Only visible to authenticated FAYNO members
- **Private**: Only visible to the owner

## How to Use

### For Users

1. **Sign Up** - Create account with email or Google OAuth
2. **Complete Profile** - Set username and profile photo
3. **Add Family Members** - Start with eldest relatives
4. **Tell Stories** - Add photos and write about each person
5. **Share** - Set privacy levels and share public profiles

### For Developers

1. **Install** - `npm install`
2. **Setup** - Configure Supabase credentials in `.env.development.local`
3. **Dev** - `npm run dev` (starts at localhost:5173)
4. **Build** - `npm run build`
5. **Deploy** - Push to Vercel or run `npm run preview`

## API Routes

The app uses TanStack Server for server functions:

- `src/server.ts` - Server entry point
- Server functions are colocated with route files and marked with `'use server'`

## Performance Optimizations

- React 19.2 with automatic memoization
- TanStack Query for efficient caching
- Lazy-loaded routes with file-based routing
- Image optimization with custom Photo component
- CSS-in-JS with design tokens for minimal bundle size

## Security

- Row-Level Security (RLS) on Supabase tables
- Input sanitization and validation with Zod
- CSRF protection via TanStack Router
- Password hashing via Supabase Auth
- Secure photo storage via authenticated uploads

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- No IE11 support

## Contributing

When adding features:
1. Follow the existing component and route patterns
2. Use design tokens for colors and spacing
3. Add TypeScript types for all data
4. Test privacy logic carefully
5. Consider mobile-first responsive design
