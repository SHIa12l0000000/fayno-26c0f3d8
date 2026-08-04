CREATE OR REPLACE FUNCTION private.photo_upload_is_allowed(_name text, _metadata jsonb)
RETURNS boolean
LANGUAGE sql
IMMUTABLE
SET search_path = public, storage
AS $$
  SELECT storage.extension(_name) = ANY (ARRAY['jpg','jpeg','png','webp','gif'])
     AND (
       _metadata IS NULL
       OR (
         (_metadata ->> 'mimetype' IS NULL
           OR _metadata ->> 'mimetype' = ANY (ARRAY['image/jpeg','image/png','image/webp','image/gif']))
         AND (_metadata ->> 'size' IS NULL
           OR (_metadata ->> 'size')::bigint <= 5242880)
       )
     )
$$;

DROP POLICY IF EXISTS "Users can upload their own photos" ON storage.objects;
CREATE POLICY "Users can upload their own photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = (auth.uid())::text
  AND private.photo_upload_is_allowed(name, metadata)
);

DROP POLICY IF EXISTS "Users can update their own photos" ON storage.objects;
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = (auth.uid())::text
)
WITH CHECK (
  bucket_id = 'photos'
  AND (storage.foldername(name))[1] = (auth.uid())::text
  AND private.photo_upload_is_allowed(name, metadata)
);