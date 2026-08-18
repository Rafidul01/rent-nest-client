"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Toggle theme"
        disabled
        className="relative text-muted-foreground hover:text-foreground"
      >
        <Sun className="size-5 opacity-0" aria-hidden="true" />
      </Button>
    );
  }

  const dark = resolvedTheme === "dark";

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="relative text-muted-foreground hover:text-foreground"
    >
      <Sun
        className={cn(
          "absolute size-5 transition-all duration-300",
          dark
            ? "rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100",
        )}
        aria-hidden="true"
      />
      <Moon
        className={cn(
          "absolute size-5 transition-all duration-300",
          dark
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0",
        )}
        aria-hidden="true"
      />
    </Button>
  );
}