import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

interface ThemeToggleProps {
  size?: "sm" | "default";
  showLabel?: boolean;
}

export function ThemeToggle({ size = "default", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      size={size === "sm" ? "sm" : "icon"}
      onClick={toggleTheme}
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={showLabel ? "gap-2" : undefined}
    >
      {resolvedTheme === "dark" ? (
        <>
          <Sun className="h-4 w-4" aria-hidden />
          {showLabel ? <span>Light</span> : null}
        </>
      ) : (
        <>
          <Moon className="h-4 w-4" aria-hidden />
          {showLabel ? <span>Dark</span> : null}
        </>
      )}
    </Button>
  );
}
