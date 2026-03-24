"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useState } from "react";
import { GiScrollQuill } from "react-icons/gi";
import { db } from "@/app/db";
import type { Vocabulary } from "@/app/db";
import AddVocabularyDialog from "@/app/box/components/AddVocabularyDialog";
import VocabularyLevelSection from "@/app/box/components/VocabularyLevelSection";

const LEVELS = [1, 2, 3, 4, 5] as const;

export default function VocabularyList() {
  const vocabularies = useLiveQuery(() =>
    db.vocabularies.where("level").belowOrEqual(5).sortBy("level")
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const vocabulariesByLevel = useMemo(() => {
    if (!vocabularies) return null;
    const grouped = new Map<number, Vocabulary[]>();
    LEVELS.forEach((level) => grouped.set(level, []));
    vocabularies.forEach((vocab) => grouped.get(vocab.level)?.push(vocab));
    return grouped;
  }, [vocabularies]);

  async function handleDelete(id: string) {
    await db.vocabularies.delete(id);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!vocabulariesByLevel ? (
        <p className="text-center text-sm text-foreground/40">
          No vocabularies yet. Tap + to add one.
        </p>
      ) : (
        <div className="space-y-6">
          {LEVELS.map((level) => (
            <VocabularyLevelSection
              key={level}
              level={level}
              vocabularies={vocabulariesByLevel.get(level) ?? []}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-22 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-lg transition-opacity hover:opacity-80"
        aria-label="Add vocabulary"
      >
        <GiScrollQuill className="text-3xl -translate-x-px" />
      </button>

      <AddVocabularyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
