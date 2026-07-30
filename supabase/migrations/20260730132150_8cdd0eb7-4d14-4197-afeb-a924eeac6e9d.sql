CREATE TYPE public.privacy_level AS ENUM ('public', 'family', 'private');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE CHECK (username ~ '^[a-z0-9_]{3,20}$'),
  full_name TEXT NOT NULL DEFAULT '',
  profile_photo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE TABLE public.family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  photo TEXT,
  full_name TEXT NOT NULL,
  relation TEXT NOT NULL DEFAULT '',
  father_name TEXT,
  mother_name TEXT,
  birth_year INTEGER,
  death_year INTEGER,
  village TEXT,
  city TEXT,
  occupation TEXT,
  about TEXT,
  privacy public.privacy_level NOT NULL DEFAULT 'family',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX family_members_user_id_idx ON public.family_members (user_id);
CREATE INDEX family_members_privacy_idx ON public.family_members (privacy);

GRANT SELECT ON public.family_members TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.family_members TO authenticated;
GRANT ALL ON public.family_members TO service_role;

ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public members are viewable by everyone"
  ON public.family_members FOR SELECT
  USING (privacy = 'public');

CREATE POLICY "Family members are viewable by signed in users"
  ON public.family_members FOR SELECT TO authenticated
  USING (privacy = 'family');

CREATE POLICY "Owners can view all their members"
  ON public.family_members FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners can add members"
  ON public.family_members FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can update members"
  ON public.family_members FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can delete members"
  ON public.family_members FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER family_members_set_updated_at
  BEFORE UPDATE ON public.family_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();