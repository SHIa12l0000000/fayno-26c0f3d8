import { usePhotoUrl } from "@/lib/photos";
import { initials } from "@/lib/family";
import { cn } from "@/lib/utils";

export function Photo({
  path,
  name,
  className,
  rounded = "rounded-xl",
}: {
  path: string | null | undefined;
  name: string;
  className?: string;
  rounded?: string;
}) {
  const url = usePhotoUrl(path);

  if (!url) {
    return (
      <div
        aria-hidden
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground select-none",
          rounded,
          className,
        )}
      >
        <span className="text-sm font-medium tracking-wide">{initials(name) || "?"}</span>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt={name}
      loading="lazy"
      decoding="async"
      className={cn("object-cover bg-muted", rounded, className)}
    />
  );
}
