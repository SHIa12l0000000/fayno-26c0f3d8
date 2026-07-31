CREATE SCHEMA IF NOT EXISTS private;

CREATE OR REPLACE FUNCTION private.profile_has_public_members(_profile_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members m
    WHERE m.user_id = _profile_id AND m.privacy = 'public'
  )
$$;

CREATE OR REPLACE FUNCTION private.photo_is_public(_object_name text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members m
    WHERE m.photo = _object_name AND m.privacy = 'public'
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.profile_photo = _object_name
      AND EXISTS (SELECT 1 FROM public.family_members m2 WHERE m2.user_id = p.id AND m2.privacy = 'public')
  )
$$;

CREATE OR REPLACE FUNCTION private.photo_is_shared(_object_name text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members m
    WHERE m.photo = _object_name AND m.privacy IN ('public','family')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.profile_photo = _object_name
  )
$$;

GRANT USAGE ON SCHEMA private TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.profile_has_public_members(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.photo_is_public(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION private.photo_is_shared(text) TO authenticated;

DROP POLICY IF EXISTS "Signed in users can read shared photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can read public photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view profiles with public records" ON public.profiles;

CREATE POLICY "Signed in users can read shared photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'photos' AND private.photo_is_shared(name));

CREATE POLICY "Anyone can read public photos"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'photos' AND private.photo_is_public(name));

CREATE POLICY "Anyone can view profiles with public records"
  ON public.profiles FOR SELECT TO anon
  USING (private.profile_has_public_members(id));

DROP FUNCTION IF EXISTS public.photo_is_public(text);
DROP FUNCTION IF EXISTS public.photo_is_shared(text);
DROP FUNCTION IF EXISTS public.profile_has_public_members(uuid);