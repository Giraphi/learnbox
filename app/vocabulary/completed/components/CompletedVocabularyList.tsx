"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
import type { Vocabulary } from "@/app/db";
import { db } from "@/app/db";
import VocabularyLevelSection from "@/app/vocabulary/components/VocabularyLevelSection";
import { FINISHED_LEVEL } from "@/lib/utils";

export default function CompletedVocabularyList() {
  const vocabularies = useLiveQuery(() =>
    db.vocabularies.where("level").aboveOrEqual(FINISHED_LEVEL).sortBy("level")
  );

  const vocabulariesByLevel = useMemo(() => {
    if (!vocabularies) return null;

    return vocabularies.reduce<Map<number, Vocabulary[]>>(
      (groupedVocabularies, vocabulary) => {
        const vocabulariesAtLevel =
          groupedVocabularies.get(vocabulary.level) ?? [];
        groupedVocabularies.set(vocabulary.level, [
          ...vocabulariesAtLevel,
          vocabulary,
        ]);
        return groupedVocabularies;
      },
      new Map<number, Vocabulary[]>()
    );
  }, [vocabularies]);

  async function handleDelete(id: string) {
    await db.vocabularies.delete(id);
  }

  if (vocabularies === undefined) {
    return (
      <p className="text-center text-sm text-foreground/40">
        Loading completed vocabulary…
      </p>
    );
  }

  if (vocabularies.length === 0 || !vocabulariesByLevel) {
    return (
      <p className="text-center text-sm text-foreground/40">
        No completed vocabulary yet.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6">
        {Array.from(vocabulariesByLevel.entries()).map(
          ([level, vocabulariesAtLevel]) => (
            <VocabularyLevelSection
              key={level}
              level={level}
              vocabularies={vocabulariesAtLevel}
              onDelete={handleDelete}
            />
          )
        )}
      </div>
    </div>
  );
}
