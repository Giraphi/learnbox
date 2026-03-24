"use client";

import { useLinkStatus } from "next/link";

type NavLinkContentProps = {
  children: React.ReactNode;
  className?: string;
};

export default function NavLinkContent({
  children,
  className = "",
}: NavLinkContentProps) {
  const { pending } = useLinkStatus();

  return (
    <span className={`${className} ${pending ? "animate-pulse" : ""}`}>
      {children}
    </span>
  );
}
