# FAYNO Quick Start

## What is FAYNO?

FAYNO is a family history preservation platform that helps you preserve family stories, memories, and genealogical records with privacy controls. Think of it as a combination of a family tree, photo album, and biography platform.

## Key Features

✓ **Family Management** - Add family members with relations, birth/death years, villages, occupations, and photos
✓ **Story Preservation** - Write stories and biographies for each family member  
✓ **Photo Storage** - Upload and organize family photographs
✓ **Privacy Controls** - Choose between Public, Family-Only, or Private for each member
✓ **Public Search** - Help others discover your public family records
✓ **Beautiful Design** - Clean, modern interface inspired by Notion and GitHub

## Live Demo

Visit https://fayno.vercel.app to see it in action.

## Getting Started (5 minutes)

### 1. Sign Up
- Go to the landing page
- Click "Get started"
- Create an account with email or Google
- Set your username and profile photo

### 2. Add Your First Member
- Click "Add member" on the dashboard
- Enter a name and relation (parent, grandparent, etc.)
- Add birth year and village (optional but helpful)
- Set privacy level (start with "Family only")
- Click Save

### 3. Add a Story
- Go to the member's page
- Click Edit
- In the "Story" field, write about them
- Add their occupation, parents' names, etc.
- Save

### 4. Share
- Make members "Public" to share on your profile
- Copy your public profile URL (shows on dashboard)
- Share with family and friends

## For Developers

### Setup (10 minutes)

```bash
# Clone and install
git clone <repo>
cd fayno
npm install

# Configure environment
# Copy .env.example to .env.development.local
# Add your Supabase credentials

# Start development
npm run dev
```

Opens at http://localhost:8081

### Project Structure
```
src/
├── routes/           # Pages (TanStack Router)
├── components/       # Reusable UI components
├── lib/             # Utilities (auth, family, photos)
├── integrations/    # Supabase, OAuth setup
└── styles.css       # Global styles with design tokens
```

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Framework**: TanStack Start (meta-framework)
- **Styling**: Tailwind CSS v4 with design tokens
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth + OAuth
- **State**: TanStack Query
- **Routing**: TanStack Router
- **UI**: shadcn/ui components

### Key Files
- `src/routes/` - All pages and routes
- `src/lib/auth.tsx` - Authentication context
- `src/lib/family.ts` - Family data types and utils
- `src/components/MemberForm.tsx` - Add/edit family members
- `src/styles.css` - Design system tokens

### Common Tasks

**Add a new page:**
```typescript
// src/routes/new-page.tsx
export const Route = createFileRoute('/new-page')({
  component: NewPage,
});

function NewPage() {
  return <PageShell>Your content</PageShell>;
}
```

**Query family members:**
```typescript
const { data: members } = useQuery({
  queryKey: ['family'],
  queryFn: async () => {
    const { data } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', userId);
    return data;
  },
});
```

**Update database:**
```typescript
const { error } = await supabase
  .from('family_members')
  .update({ about: 'New story' })
  .eq('id', memberId);
```

## Privacy & Security

- **Row-Level Security** - Users can only see their own records
- **Three Privacy Levels**:
  - Public: Anyone can find in search
  - Family: Only FAYNO members can view
  - Private: Only you can see
- **Secure Auth** - Password hashing, optional Google OAuth
- **Secure Storage** - Photos stored in Supabase with auth checks

## Deployment

### Vercel (Recommended)
```bash
git push origin main
# Automatically deploys to Vercel
```

### Self-Hosted
```bash
npm run build
npm start
# Runs on port 3000
```

See DEPLOYMENT.md for full details.

## Browser Support
- Chrome, Firefox, Safari, Edge (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Performance Tips
- Images: Keep photos under 2MB
- Search: Searches public records in real-time
- Caching: Family data cached for 5 minutes
- Database: Indexes on frequently searched fields

## Common Issues

**Q: Can I import from Ancestry.com?**
A: Not yet, but you can manually add members or bulk import via spreadsheet (future feature).

**Q: How many members can I add?**
A: Unlimited. Each record is ~1KB, so thousands fit easily.

**Q: Can I delete a member?**
A: Yes, any time. It cannot be undone.

**Q: Is my data private?**
A: Yes. Only people you share with can see family-only records. Private records are only for you.

**Q: How do I export my data?**
A: You can request a data export from your profile settings (future feature).

## Resources

- **Full Guide**: See FAYNO_GUIDE.md
- **Deployment**: See DEPLOYMENT.md
- **Database Schema**: See `.sql` files in migrations/
- **Components**: Check shadcn/ui docs at ui.shadcn.com

## Support

- Check the docs in the repo
- Review existing code for patterns
- Search issues on GitHub
- Contact: support@fayno.io (or your contact)

## Contributing

Want to improve FAYNO? Great!

1. Check existing issues
2. Create a feature branch
3. Follow the code patterns in the repo
4. Test thoroughly (especially privacy)
5. Submit a pull request

## License

MIT License - See LICENSE file

---

**Start preserving your family's stories today!** ✨
