-- Remove blanket cross-account read of 'family'-privacy records
DROP POLICY IF EXISTS "Family members are viewable by signed in users" ON public.family_members;

-- Photos attached to non-public records must not be readable by unrelated signed-in users
CREATE OR REPLACE FUNCTION private.photo_is_shared(_object_name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.family_members m
    WHERE m.photo = _object_name AND m.privacy = 'public'
  ) OR EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.profile_photo = _object_name
  )
$function$;