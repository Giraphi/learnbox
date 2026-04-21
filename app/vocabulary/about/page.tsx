import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const SHARE_URL = "https://learnbox-roan.vercel.app/";

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="mb-8 flex w-full items-start flex-col">
        <Link
          href="/vocabulary"
          className="flex items-center gap-0.5 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>
        <h1 className="flex-1 text-center text-2xl font-semibold tracking-tight">
          About this app
        </h1>
        <div className="w-[52px]" />
      </div>
      <div className="flex w-full max-w-md flex-col gap-4 text-sm text-foreground/80">
        <p>Learnbox is a small, personal vocabulary trainer.</p>
        <p className="text-foreground/60">
          The app can be installed by visiting this link:
        </p>
        <a
          href={SHARE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3 font-mono text-sm text-foreground transition-colors hover:border-foreground/20 hover:bg-foreground/10"
        >
          {SHARE_URL}
        </a>
      </div>
    </div>
  );
}
