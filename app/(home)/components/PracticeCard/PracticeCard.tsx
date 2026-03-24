"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { GiCheckMark, GiSheikahEye, GiUncertainty } from "react-icons/gi";
import { db } from "@/app/db";
import type { Vocabulary } from "@/app/db";

function pickRandom(
  items: Vocabulary[],
  excludeId?: string
): Vocabulary | null {
  if (items.length === 0) return null;
  const candidates =
    excludeId !== undefined ? items.filter((v) => v.id !== excludeId) : items;
  const pool = candidates.length > 0 ? candidates : items;
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRandomSentenceIndex(sentenceCount: number): number {
  if (sentenceCount === 0) return -1;
  return Math.floor(Math.random() * sentenceCount);
}

function censorWord(sentence: string, word: string): string {
  return sentence.replace(new RegExp(word, "gi"), (match) =>
    "_".repeat(Math.floor(match.length * 0.8 + 1))
  );
}

export default function PracticeCard() {
  const [current, setCurrent] = useState<Vocabulary | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sentenceIndex, setSentenceIndex] = useState(0);

  const vocabularies = useLiveQuery(
    () => db.vocabularies.where("level").below(6).toArray(),
    []
  );

  const isCurrentValid =
    current !== null && vocabularies?.some((v) => v.id === current.id);

  if (vocabularies && vocabularies.length > 0 && !isCurrentValid) {
    const next = pickRandom(vocabularies);
    setCurrent(next);
    setSentenceIndex(
      pickRandomSentenceIndex(next?.exampleSentences?.length ?? 0)
    );
  }
  if (vocabularies && vocabularies.length === 0 && current !== null) {
    setCurrent(null);
  }

  const exampleSentence = current?.exampleSentences?.[sentenceIndex] ?? null;

  const censoredSentence = exampleSentence
    ? censorWord(exampleSentence, current!.english)
    : null;

  function advance() {
    const next = vocabularies ? pickRandom(vocabularies, current?.id) : null;
    setCurrent(next);
    setIsRevealed(false);
    setSentenceIndex(
      pickRandomSentenceIndex(next?.exampleSentences?.length ?? 0)
    );
  }

  async function handlePass() {
    if (!current) return;
    await db.vocabularies.update(current.id, { level: current.level + 1 });
    advance();
  }

  async function handleFail() {
    if (!current) return;
    const newLevel = current.level >= 2 ? current.level - 1 : 1;
    await db.vocabularies.update(current.id, { level: newLevel });
    advance();
  }

  if (!current) {
    return (
      <p className="text-center text-sm text-foreground/40">
        No vocabularies to practise.
      </p>
    );
  }

  return (
    <div
      key={`${current.id}-${sentenceIndex}`}
      className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-foreground/15 bg-foreground/3 p-6"
    >
      <p className="text-center text-2xl font-semibold tracking-tight">
        {current.german}
      </p>
      {exampleSentence && (
        <p className="text-center text-sm italic text-foreground/70">
          {isRevealed ? exampleSentence : censoredSentence}
        </p>
      )}
      <p
        className={`text-center text-base text-foreground/70 ${
          isRevealed ? "visible" : "invisible"
        }`}
      >
        {current.english}
      </p>

      <div className="flex justify-between">
        <button
          onClick={handleFail}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/15 transition-colors hover:bg-red-500/10"
          aria-label="Fail"
        >
          <GiUncertainty className="text-lg text-red-500" />
        </button>

        <button
          onClick={() => setIsRevealed(true)}
          disabled={isRevealed}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/15 transition-colors hover:bg-foreground/5 disabled:opacity-40"
          aria-label="Reveal"
        >
          <GiSheikahEye className="text-xl" />
        </button>

        <button
          onClick={handlePass}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/15 transition-colors hover:bg-emerald-500/10"
          aria-label="Pass"
        >
          <GiCheckMark className="text-lg text-emerald-500" />
        </button>
      </div>
    </div>
  );
}
