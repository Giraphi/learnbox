"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { GiSheikahEye, GiSkullCrack, GiTrophyCup } from "react-icons/gi";
import { db } from "@/app/db";
import type { Vocabulary } from "@/app/db";

function pickRandom(items: Vocabulary[]): Vocabulary | null {
  if (items.length === 0) return null;
  return items[Math.floor(Math.random() * items.length)];
}

export default function PracticeCard() {
  const [current, setCurrent] = useState<Vocabulary | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [seed, setSeed] = useState(0);

  const vocabularies = useLiveQuery(
    () => db.vocabularies.where("level").below(6).toArray(),
    []
  );

  const isCurrentValid =
    current !== null &&
    vocabularies?.some((v) => v.id === current.id);

  if (vocabularies && vocabularies.length > 0 && !isCurrentValid) {
    setCurrent(pickRandom(vocabularies));
  }
  if (vocabularies && vocabularies.length === 0 && current !== null) {
    setCurrent(null);
  }

  function advance() {
    setCurrent(null);
    setIsRevealed(false);
    setSeed((s) => s + 1);
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
      key={`${current.id}-${seed}`}
      className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-foreground/15 bg-foreground/3 p-6"
    >
      <div className="flex flex-col items-center gap-2">
        <p className="text-center text-2xl font-semibold tracking-tight">
          {current.german}
        </p>
        <p
          className={`text-center text-base text-foreground/50 ${
            isRevealed ? "visible" : "invisible"
          }`}
        >
          {current.english}
        </p>
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleFail}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/15 transition-colors hover:bg-red-500/10"
          aria-label="Fail"
        >
          <GiSkullCrack className="text-xl text-red-500" />
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
          <GiTrophyCup className="text-xl text-emerald-500" />
        </button>
      </div>
    </div>
  );
}
