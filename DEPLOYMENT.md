# FAYNO Deployment Guide

## Quick Start

### Prerequisites
- Node.js 18+ and npm/pnpm
- Supabase account with database and auth configured
- Vercel account (optional, for hosting)

### Environment Setup

1. **Create `.env.development.local` with your Supabase credentials:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

2. **Create `.env.production` for production deployment:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Database Setup

The app requires these Supabase tables:

#### profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  username VARCHAR(20) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  profile_photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_username ON profiles(username);
```

#### family_members
```sql
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  relation VARCHAR(50),
  birth_year INTEGER,
  death_year INTEGER,
  village VARCHAR(255),
  city VARCHAR(255),
  occupation VARCHAR(255),
  father_name VARCHAR(255),
  mother_name VARCHAR(255),
  about TEXT,
  photo TEXT,
  privacy VARCHAR(20) DEFAULT 'family',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_family_members_privacy ON family_members(privacy);
CREATE INDEX idx_family_members_full_name ON family_members(full_name);
```

#### Storage Buckets

1. Create bucket `profile-photos` (public)
2. Create bucket `family-photos` (public, requires auth upload)

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Opens at http://localhost:5173
```

### Building

```bash
# Production build
npm run build

# Test production build locally
npm run preview
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Connect GitHub repo to Vercel**
   ```bash
   git push origin main
   ```

2. **Set environment variables in Vercel project settings**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

3. **Deploy**
   ```bash
   vercel deploy --prod
   ```

### Option 2: Self-Hosted (Node)

```bash
# Build
npm run build

# Run production server
NODE_ENV=production npm run start
```

Runs on port 3000 by default.

### Option 3: Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t fayno .
docker run -p 3000:3000 -e VITE_SUPABASE_URL=... -e VITE_SUPABASE_ANON_KEY=... fayno
```

## Database Backups

Supabase automatically creates daily backups. To manually backup:

```bash
# Using Supabase CLI
supabase db pull  # Pull schema
supabase db dump --file backup.sql  # Export data
```

## Monitoring

### Key Metrics to Track
- User signups per day
- Active users per month
- Average family members per user
- Storage usage (photos)
- Database query performance

### Error Tracking
Configure Lovable error reporting in `src/lib/lovable-error-reporting.ts`

## Security Checklist

- [ ] Enable HTTPS only
- [ ] Set secure password policies
- [ ] Configure CORS properly
- [ ] Enable Supabase RLS policies
- [ ] Set up daily backups
- [ ] Monitor failed login attempts
- [ ] Review storage bucket permissions
- [ ] Test OAuth provider credentials

## Performance Optimization

### Image Optimization
The app uses Supabase Storage for images. Optimize with:
- Resize before upload (max 2MB)
- Use WebP format when possible
- Implement lazy loading for family trees

### Database Optimization
- Monitor slow queries in Supabase logs
- Create indexes on frequently searched fields
- Archive old photos (older than 5 years)

### Caching
- TanStack Query caches for 5 minutes by default
- Configure longer cache for public profiles (24 hours)
- Use CDN for static assets

## Troubleshooting

### "Cannot connect to Supabase"
- Verify credentials in `.env`
- Check Supabase project is running
- Confirm API keys have correct permissions

### "Photo upload fails"
- Check Storage bucket permissions
- Verify user has auth session
- Check file size (max 2MB)
- Try different file format

### "Username already taken"
- Supabase unique constraint enforced
- Show user alternatives
- Consider username availability check on signup

## Support

For issues:
1. Check logs: `npm run dev` shows console errors
2. Inspect Network tab in dev tools
3. Review Supabase dashboard for DB errors
4. Contact support with error messages
