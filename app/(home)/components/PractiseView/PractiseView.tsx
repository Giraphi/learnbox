"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { PartyPopper } from "lucide-react";
import { db } from "@/app/db";
import type { Vocabulary, LevelChange } from "@/app/db";
import PractiseCard from "@/app/(home)/components/PractiseView/PractiseCard";

function pickRandom(
  items: Vocabulary[],
  excludeId?: string,
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

function hasPractisedToday(
  levelChange: LevelChange | undefined | null,
): boolean {
  if (!levelChange) return false;
  if (levelChange.change === "none") return false;
  const now = new Date();
  const date = levelChange.date;
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function setNextItem(
  item: Vocabulary | null,
  setCurrent: (v: Vocabulary | null) => void,
  setSentenceIndex: (i: number) => void,
) {
  setCurrent(item);
  setSentenceIndex(
    pickRandomSentenceIndex(item?.exampleSentences?.length ?? 0),
  );
}

export default function PractiseView() {
  const [current, setCurrent] = useState<Vocabulary | null>(null);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isFreePracticeMode, setIsFreePracticeMode] = useState(false);
  const [includeCompleted, setIncludeCompleted] = useState(true);

  const activeVocabularies = useLiveQuery(
    () => db.vocabularies.where("level").below(6).toArray(),
    [],
  );

  const allVocabularies = useLiveQuery(() => db.vocabularies.toArray(), []);

  const vocabularies = activeVocabularies;
  const freePracticePool = includeCompleted
    ? allVocabularies
    : activeVocabularies;

  const unpractisedToday =
    vocabularies?.filter((v) => !hasPractisedToday(v.lastLevelChange)) ?? [];

  const currentPool = isFreePracticeMode ? freePracticePool : vocabularies;
  const isCurrentValid =
    current !== null && currentPool?.some((v) => v.id === current.id);

  if (currentPool && currentPool.length > 0 && !isCurrentValid) {
    if (!isFreePracticeMode && unpractisedToday.length > 0) {
      setNextItem(pickRandom(unpractisedToday), setCurrent, setSentenceIndex);
    } else {
      if (!isFreePracticeMode) setIsFreePracticeMode(true);
      setNextItem(pickRandom(currentPool), setCurrent, setSentenceIndex);
    }
  }

  if (currentPool && currentPool.length === 0 && current !== null) {
    setCurrent(null);
  }

  function advance() {
    if (!currentPool) return;

    // Exclude the current item — its lastLevelChange is stale in the snapshot
    const remainingUnpractised = unpractisedToday.filter(
      (v) => v.id !== current?.id,
    );

    if (!isFreePracticeMode && remainingUnpractised.length > 0) {
      setNextItem(
        pickRandom(remainingUnpractised),
        setCurrent,
        setSentenceIndex,
      );
    } else {
      if (!isFreePracticeMode) setIsFreePracticeMode(true);
      setNextItem(
        pickRandom(currentPool, current?.id),
        setCurrent,
        setSentenceIndex,
      );
    }

  }

  async function handlePass() {
    if (!current) return;
    if (!isFreePracticeMode) {
      await db.vocabularies.update(current.id, {
        level: current.level + 1,
        lastLevelChange: { date: new Date(), change: "up" },
      });
    }
    advance();
  }

  async function handleFail() {
    if (!current) return;
    if (!isFreePracticeMode) {
      const newLevel = current.level >= 2 ? current.level - 1 : 1;
      await db.vocabularies.update(current.id, {
        level: newLevel,
        lastLevelChange: { date: new Date(), change: "down" },
      });
    }
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
    <>
      <PractiseCard
        vocabulary={current}
        sentenceIndex={sentenceIndex}
        onPass={handlePass}
        onFail={handleFail}
      />
      {isFreePracticeMode && (
        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5">
            <PartyPopper className="h-4 w-4 text-emerald-500" strokeWidth={2} />
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Done for today — free practice mode
            </p>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <button
              role="switch"
              aria-checked={includeCompleted}
              onClick={() => setIncludeCompleted((prev) => !prev)}
              className={`relative h-5 w-9 rounded-full transition-colors ${
                includeCompleted ? "bg-emerald-500" : "bg-foreground/20"
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                  includeCompleted ? "translate-x-4" : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-xs text-foreground/40">
              Include completed
            </span>
          </label>
        </div>
      )}
    </>
  );
}
