CREATE OR REPLACE FUNCTION public.profile_has_public_members(_profile_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members m
    WHERE m.user_id = _profile_id AND m.privacy = 'public'
  )
$$;

CREATE OR REPLACE FUNCTION public.photo_is_public(_object_name text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members m
    WHERE m.photo = _object_name AND m.privacy = 'public'
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.profile_photo = _object_name
      AND public.profile_has_public_members(p.id)
  )
$$;

CREATE OR REPLACE FUNCTION public.photo_is_shared(_object_name text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members m
    WHERE m.photo = _object_name AND m.privacy IN ('public','family')
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.profile_photo = _object_name
  )
$$;

GRANT EXECUTE ON FUNCTION public.profile_has_public_members(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.photo_is_public(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.photo_is_shared(text) TO authenticated;

DROP POLICY IF EXISTS "Photos are readable" ON storage.objects;

CREATE POLICY "Owners can read their own photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'photos' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Signed in users can read shared photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'photos' AND public.photo_is_shared(name));

CREATE POLICY "Anyone can read public photos"
  ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'photos' AND public.photo_is_public(name));

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Signed in users can view profiles"
  ON public.profiles FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Anyone can view profiles with public records"
  ON public.profiles FOR SELECT TO anon
  USING (public.profile_has_public_members(id));