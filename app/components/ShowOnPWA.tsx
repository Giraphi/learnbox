"use client";

import { type ReactNode } from "react";
import { useIsStandalone } from "@/app/hooks/useIsStandalone";

type ShowOnPWAProps = {
  children: ReactNode;
  fallback: ReactNode;
};

export default function ShowOnPWA({ children, fallback }: ShowOnPWAProps) {
  const isStandalone = useIsStandalone();

  if (!isStandalone) return fallback;

  return children;
}
