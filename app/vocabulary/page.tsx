import Link from "next/link";
import { ChevronRight } from "lucide-react";
import VocabularyList from "@/app/vocabulary/components/VocabularyList";

export default function BoxPage() {
  return (
    <div className="flex flex-1 flex-col items-start px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Vocabulary</h1>
      <VocabularyList />
      <Link
        href="/vocabulary/completed"
        className="w-full mb-6 mt-6 flex items-start gap-1 text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
      >
        <span className="flex items-center gap-1 text-xs font-semibold  tracking-wide text-foreground/50 uppercase">
          Completed
          <ChevronRight className="size-4" />
        </span>
      </Link>
    </div>
  );
}
