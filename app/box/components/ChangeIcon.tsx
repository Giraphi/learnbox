import { Triangle, Circle } from "lucide-react";
import type { LevelChange } from "@/app/db";
import { cn } from "@/lib/utils";

type ChangeIconProps = {
  lastLevelChange: LevelChange;
  className?: string;
};

function isToday(date: Date) {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default function ChangeIcon({ lastLevelChange, className }: ChangeIconProps) {
  const { date, change } = lastLevelChange;
  const isActiveChange = isToday(date) && change !== "none";

  if (isActiveChange && change === "up") {
    return (
      <Triangle className={cn("size-2 shrink-0 fill-green-500 text-green-500", className)} />
    );
  }

  if (isActiveChange && change === "down") {
    return (
      <Triangle className={cn("size-2 shrink-0 rotate-180 fill-red-500 text-red-500", className)} />
    );
  }

  return (
    <Circle className={cn("size-1.5 shrink-0 fill-foreground/25 text-foreground/25", className)} />
  );
}
