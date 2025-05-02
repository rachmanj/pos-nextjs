"use client";

import { SessionProvider } from "next-auth/react";
import { PropsWithChildren } from "react";
import { ThemeScript } from "./theme-script";

export function Providers({ children }: PropsWithChildren) {
  return (
    <SessionProvider>
      <ThemeScript />
      {children}
    </SessionProvider>
  );
}
