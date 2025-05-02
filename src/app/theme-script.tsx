"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

// This component is used to ensure the theme is set correctly before hydration
export function ThemeScript() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Force theme application after hydration
    if (theme) {
      setTheme(theme);
    }
  }, [setTheme, theme]);

  return null;
}
