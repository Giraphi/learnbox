"use client";

import { useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence } from "motion/react";
import { PartyPopper } from "lucide-react";
import { db } from "@/app/db";
import type { Vocabulary, LevelChange } from "@/app/db";
import PractiseCard from "@/app/(home)/components/PractiseView/PractiseCard";
import PoolModeSelector, {
  type PoolMode,
} from "@/app/(home)/components/PractiseView/PoolModeSelector";
import { usePractiseState } from "@/contexts/PractiseStateContext";

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

function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

function hasPractisedToday(
  levelChange: LevelChange | undefined | null,
): boolean {
  if (!levelChange) return false;
  if (levelChange.change === "none") return false;
  return isToday(levelChange.date);
}

function isFailedToday(vocabulary: Vocabulary): boolean {
  const { lastLevelChange } = vocabulary;
  if (!lastLevelChange) return false;
  if (lastLevelChange.change !== "down") return false;
  return isToday(lastLevelChange.date);
}

type GetFreePracticePoolParams = {
  poolMode: PoolMode;
  activeVocabularies: Vocabulary[] | undefined;
  allVocabularies: Vocabulary[] | undefined;
};

function getFreePracticePool({
  poolMode,
  activeVocabularies,
  allVocabularies,
}: GetFreePracticePoolParams): Vocabulary[] | undefined {
  if (poolMode === "current") return activeVocabularies;
  if (poolMode === "failed-today") {
    return allVocabularies?.filter(isFailedToday);
  }
  return allVocabularies;
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
  const {
    current,
    setCurrent,
    sentenceIndex,
    setSentenceIndex,
    isFreePracticeMode,
    setIsFreePracticeMode,
    poolMode,
    setPoolMode,
  } = usePractiseState();

  const activeVocabularies = useLiveQuery(
    () => db.vocabularies.where("level").below(6).toArray(),
    [],
  );

  const allVocabularies = useLiveQuery(() => db.vocabularies.toArray(), []);

  const vocabularies = activeVocabularies;

  const freePracticePool = useMemo(
    () =>
      getFreePracticePool({ poolMode, activeVocabularies, allVocabularies }),
    [poolMode, activeVocabularies, allVocabularies],
  );

  const unpractisedToday = useMemo(
    () =>
      vocabularies?.filter((v) => !hasPractisedToday(v.lastLevelChange)) ?? [],
    [vocabularies],
  );

  const currentPool = isFreePracticeMode ? freePracticePool : vocabularies;

  useEffect(() => {
    if (!currentPool) return;

    if (currentPool.length === 0) {
      if (current !== null) setCurrent(null);
      return;
    }

    const isCurrentValid =
      current !== null && currentPool.some((v) => v.id === current.id);
    if (isCurrentValid) return;

    if (!isFreePracticeMode && unpractisedToday.length > 0) {
      setNextItem(pickRandom(unpractisedToday), setCurrent, setSentenceIndex);
      return;
    }

    if (!isFreePracticeMode) setIsFreePracticeMode(true);
    setNextItem(pickRandom(currentPool), setCurrent, setSentenceIndex);
  }, [
    currentPool,
    current,
    isFreePracticeMode,
    unpractisedToday,
    setCurrent,
    setSentenceIndex,
    setIsFreePracticeMode,
  ]);

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
      <div className="flex flex-1 flex-col w-full">
        <p className="text-center text-sm text-foreground/40">
          No vocabularies to practise.
        </p>
        {isFreePracticeMode && (
          <div className="flex flex-1 flex-col justify-end items-center pb-20 pt-8">
            <PoolModeSelector value={poolMode} onChange={setPoolMode} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col w-full">
      <div className="relative flex flex-1 flex-col w-full pt-10">
        <AnimatePresence mode="wait">
          <PractiseCard
            key={`${current.id}-${sentenceIndex}`}
            vocabulary={current}
            sentenceIndex={sentenceIndex}
            onPass={handlePass}
            onFail={handleFail}
          />
        </AnimatePresence>
        <div className="flex flex-1 flex-col justify-end pb-20 w-full">
          {isFreePracticeMode && (
            <div className="flex flex-col items-center gap-4 pt-8">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20  px-4 py-1.5 bg-neutral-900">
                <PartyPopper
                  className="h-4 w-4 text-emerald-500 bg-neutral-900"
                  strokeWidth={2}
                />
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Done for today — free practice mode
                </p>
              </div>
              <PoolModeSelector value={poolMode} onChange={setPoolMode} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
