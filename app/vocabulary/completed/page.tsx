import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CompletedVocabularyList from "@/app/vocabulary/completed/components/CompletedVocabularyList";

export default function CompletedVocabularyPage() {
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
          Completed Vocabulary
        </h1>
        <div className="w-[52px]" />
      </div>
      <CompletedVocabularyList />
    </div>
  );
}
