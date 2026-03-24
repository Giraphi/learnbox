import React from "react";
import { cn } from "@/lib/utils";

export type IconProps = {
  color?: string;
  size?: string | number;
} & React.SVGAttributes<SVGElement>;

export default function Spinner({
  size = "16",
  color = "currentColor",
  className,
  ...attributes
}: IconProps) {
  return (
    <svg
      className={cn("animate-spin", className)}
      width={size}
      height={size}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...attributes}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill={color}
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
