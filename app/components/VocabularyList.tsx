"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { db } from "@/app/db";
import AddVocabularyDialog from "@/app/components/AddVocabularyDialog";

export default function VocabularyList() {
  const vocabularies = useLiveQuery(() => db.vocabularies.toArray());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleDelete(id: string) {
    await db.vocabularies.delete(id);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {!vocabularies || vocabularies.length === 0 ? (
        <p className="text-center text-sm text-foreground/40">
          No vocabularies yet. Tap + to add one.
        </p>
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
                onClick={() => handleDelete(vocab.id)}
                className="rounded-md px-2 py-1 text-xs text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground"
                aria-label={`Delete "${vocab.english}"`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => setIsDialogOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background text-2xl font-light shadow-lg transition-opacity hover:opacity-80"
        aria-label="Add vocabulary"
      >
        +
      </button>

      <AddVocabularyDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
