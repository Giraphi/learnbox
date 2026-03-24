"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { db } from "@/app/db";

type VocabularyDetailProps = {
  id: string;
};

const MIN_LEVEL = 1;
const MAX_LEVEL = 5;

export default function VocabularyDetail({ id }: VocabularyDetailProps) {
  const router = useRouter();
  const vocabulary = useLiveQuery(() => db.vocabularies.get(id), [id]);

  if (vocabulary === undefined) {
    return (
      <p className="text-center text-sm text-foreground/40 animate-pulse">
        Loading…
      </p>
    );
  }

  if (vocabulary === null) {
    return (
      <p className="text-center text-sm text-foreground/40">Entry not found.</p>
    );
  }

  async function handleIncreaseLevel() {
    if (!vocabulary || vocabulary.level >= MAX_LEVEL) return;
    await db.vocabularies.update(id, { level: vocabulary.level + 1 });
  }

  async function handleDecreaseLevel() {
    if (!vocabulary || vocabulary.level <= MIN_LEVEL) return;
    await db.vocabularies.update(id, { level: vocabulary.level - 1 });
  }

  async function handleDelete() {
    await db.vocabularies.delete(id);
    router.push("/box");
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <button
        onClick={() => router.push("/box")}
        className="self-start text-sm text-foreground/50 transition-colors hover:text-foreground"
      >
        ← Back
      </button>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {vocabulary.english}
        </h1>
        <p className="text-base text-foreground/50">{vocabulary.german}</p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-foreground/10 p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
          Level
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDecreaseLevel}
            disabled={vocabulary.level <= MIN_LEVEL}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/15 transition-colors hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Decrease level"
          >
            <ChevronDown className="size-5 text-red-500" />
          </button>

          <span className="min-w-[3ch] text-center text-xl font-semibold tabular-nums">
            {vocabulary.level}
          </span>

          <button
            onClick={handleIncreaseLevel}
            disabled={vocabulary.level >= MAX_LEVEL}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/15 transition-colors hover:bg-emerald-500/10 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="Increase level"
          >
            <ChevronUp className="size-5 text-emerald-500" />
          </button>
        </div>
      </div>

      <button
        onClick={handleDelete}
        className="self-start rounded-lg px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-500/10"
      >
        Delete entry
      </button>
    </div>
  );
}
