import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("skeleton-reluctant rounded bg-foreground/10", className)} />
  );
}
