import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "photos";

/** Image types the storage bucket accepts. Server-side rules enforce the same list. */
export const ALLOWED_PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export async function uploadPhoto(userId: string, file: File) {
  const ext = ALLOWED_PHOTO_TYPES[file.type];
  if (!ext) throw new Error("Please choose a JPG, PNG, WebP or GIF image.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Please choose an image under 5MB.");

  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  return path;
}

export function usePhotoUrl(path: string | null | undefined) {
  const { data } = useQuery({
    queryKey: ["photo", path],
    enabled: Boolean(path),
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path!, 60 * 60);
      if (error) throw error;
      return data.signedUrl;
    },
  });
  return data ?? null;
}
