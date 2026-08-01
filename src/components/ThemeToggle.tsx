import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";

interface ThemeToggleProps {
  size?: "sm" | "default";
  showLabel?: boolean;
}

export function ThemeToggle({ size = "default", showLabel = false }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      type="button"
      variant="outline"
      size={size === "sm" ? "sm" : "icon"}
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className={showLabel ? "gap-2" : undefined}
    >
      {isDark ? (
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

