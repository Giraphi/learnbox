"use client";

import { type ReactNode } from "react";
import { useIsStandalone } from "@/hooks/useIsStandalone";

type ShowOnPWAProps = {
  children: ReactNode;
  fallback: ReactNode;
};

export default function ShowOnPWA({ children, fallback }: ShowOnPWAProps) {
  const isStandalone = useIsStandalone();
  const isDevelopment = process.env.NEXT_PUBLIC_VERCEL_ENV === "development";

  if (!isStandalone && !isDevelopment) return fallback;

  return children;
}
