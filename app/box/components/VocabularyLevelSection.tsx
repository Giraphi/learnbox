"use client";

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
            <li
              key={vocab.id}
              className="group flex items-center justify-between rounded-lg border border-foreground/10 px-4 py-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{vocab.english}</span>
                <span className="text-xs text-foreground/50">
                  {vocab.german}
                </span>
              </div>
              <button
                onClick={() => onDelete(vocab.id)}
                className="rounded-md px-2 py-1 text-xs text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground"
                aria-label={`Delete "${vocab.english}"`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
