"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Define our own props type
type ThemeProviderProps = {
  children: React.ReactNode;
  [key: string]: any; // Allow any props that next-themes supports
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 