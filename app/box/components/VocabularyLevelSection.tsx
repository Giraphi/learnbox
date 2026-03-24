"use client";

import Link from "next/link";
import { Triangle } from "lucide-react";
import type { Vocabulary } from "@/app/db";

type VocabularyLevelSectionProps = {
  level: number;
  vocabularies: Vocabulary[];
  onDelete: (id: string) => void;
};

export default function VocabularyLevelSection({
  level,
  vocabularies,
  onDelete,
}: VocabularyLevelSectionProps) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/50">
        Level {level}
      </h2>
      {vocabularies.length === 0 ? (
        <p className="text-xs text-foreground/30">No entries</p>
      ) : (
        <ul className="space-y-2">
          {vocabularies.map((vocab) => (
            <li key={vocab.id}>
              <Link
                href={`/box/${vocab.id}`}
                className="group flex items-center justify-between rounded-lg border border-foreground/10 px-4 py-3 transition-colors hover:bg-foreground/5"
              >
                <div className="flex items-center gap-4">
                  {vocab.lastLevelChange.change === "up" && (
                    <Triangle className="size-2 shrink-0 fill-green-500 text-green-500" />
                  )}
                  {vocab.lastLevelChange.change === "down" && (
                    <Triangle className="size-2 shrink-0 rotate-180 fill-red-500 text-red-500" />
                  )}
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium">{vocab.english}</span>
                    <span className="text-xs text-foreground/50">
                      {vocab.german}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onDelete(vocab.id);
                  }}
                  className="rounded-md px-2 py-1 text-xs text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground"
                  aria-label={`Delete "${vocab.english}"`}
                >
                  Delete
                </button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
