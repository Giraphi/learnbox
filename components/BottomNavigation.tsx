"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GiBrain } from "react-icons/gi";
import BookCoverIcon from "@/components/BookCoverIcon";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
};

export default function BottomNavigation() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      href: "/",
      label: "Practise",
      icon: <GiBrain className="size-6" />,
      activeIcon: <GiBrain className="size-6" />,
    },
    {
      href: "/box",
      label: "Write",
      icon: <BookCoverIcon className="size-6" />,
      activeIcon: <BookCoverIcon className="size-6" />,
    },
  ];

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav className="fixed w-full bottom-0 z-50 border-t border-foreground/10 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                active ? "text-foreground" : "text-foreground/40"
              }`}
            >
              {active ? item.activeIcon : item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
