"use client";

import { useState, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { GiCheckMark, GiSheikahEye, GiUncertainty } from "react-icons/gi";
import { db } from "@/app/db";
import type { Vocabulary } from "@/app/db";
import { generateExampleSentence } from "@/app/(home)/components/PracticeCard/actions";
import Skeleton from "@/components/Skeleton";

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

export default function PracticeCard() {
  const [current, setCurrent] = useState<Vocabulary | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [seed, setSeed] = useState(0);
  const [exampleSentence, setExampleSentence] = useState<{
    censored: string;
    uncensored: string;
  } | null>(null);

  const vocabularies = useLiveQuery(
    () => db.vocabularies.where("level").below(6).toArray(),
    []
  );

  const isCurrentValid =
    current !== null && vocabularies?.some((v) => v.id === current.id);

  if (vocabularies && vocabularies.length > 0 && !isCurrentValid) {
    setCurrent(pickRandom(vocabularies));
  }
  if (vocabularies && vocabularies.length === 0 && current !== null) {
    setCurrent(null);
  }

  // const currentEnglish = current?.english;

  useEffect(() => {
    if (!current?.english || !current?.german) return;
    let ignore = false;
    generateExampleSentence(current?.english, current?.german).then(
      (result) => {
        if (ignore) return;

        setExampleSentence({
          censored: result.censored,
          uncensored: result.uncensored,
        });
      }
    );
    return () => {
      ignore = true;
    };
  }, [current, seed]);

  function advance() {
    setCurrent(vocabularies ? pickRandom(vocabularies, current?.id) : null);
    setIsRevealed(false);
    setExampleSentence(null);
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
      <p className="text-center text-2xl font-semibold tracking-tight">
        {current.german}
      </p>
      <div className="flex h-10 items-center justify-center text-center text-sm italic text-foreground/70">
        {exampleSentence ? (
          isRevealed ? (
            exampleSentence.uncensored
          ) : (
            exampleSentence.censored
          )
        ) : (
          <div className="flex w-full flex-col items-center gap-1.5">
            <Skeleton className="h-3.5 w-4/5" />
            <Skeleton className="h-3.5 w-3/5" />
          </div>
        )}
      </div>
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
