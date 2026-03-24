"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { GiCheckMark, GiSheikahEye, GiUncertainty } from "react-icons/gi";
import { db } from "@/app/db";
import type { Vocabulary, LevelChange } from "@/app/db";

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

function hasPractisedToday(
  levelChange: LevelChange | undefined | null
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

function censorWord(sentence: string, word: string): string {
  return sentence.replace(new RegExp(word, "gi"), (match) =>
    "_".repeat(Math.floor(match.length * 0.8 + 1))
  );
}

function setNextItem(
  item: Vocabulary | null,
  setCurrent: (v: Vocabulary | null) => void,
  setSentenceIndex: (i: number) => void
) {
  setCurrent(item);
  setSentenceIndex(
    pickRandomSentenceIndex(item?.exampleSentences?.length ?? 0)
  );
}

export default function PractiseCard() {
  const [current, setCurrent] = useState<Vocabulary | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isFreePracticeMode, setIsFreePracticeMode] = useState(false);

  const vocabularies = useLiveQuery(
    () => db.vocabularies.where("level").below(6).toArray(),
    []
  );

  const unpractisedToday =
    vocabularies?.filter((v) => !hasPractisedToday(v.lastLevelChange)) ?? [];

  const isCurrentValid =
    current !== null && vocabularies?.some((v) => v.id === current.id);

  if (vocabularies && vocabularies.length > 0 && !isCurrentValid) {
    if (!isFreePracticeMode && unpractisedToday.length > 0) {
      setNextItem(pickRandom(unpractisedToday), setCurrent, setSentenceIndex);
    } else {
      if (!isFreePracticeMode) setIsFreePracticeMode(true);
      setNextItem(pickRandom(vocabularies), setCurrent, setSentenceIndex);
    }
  }

  if (vocabularies && vocabularies.length === 0 && current !== null) {
    setCurrent(null);
  }

  const exampleSentence = current?.exampleSentences?.[sentenceIndex] ?? null;

  const censoredSentence = exampleSentence
    ? censorWord(exampleSentence, current!.english)
    : null;

  function advance() {
    if (!vocabularies) return;

    // Exclude the current item — its lastLevelChange is stale in the snapshot
    const remainingUnpractised = unpractisedToday.filter(
      (v) => v.id !== current?.id
    );

    if (!isFreePracticeMode && remainingUnpractised.length > 0) {
      setNextItem(
        pickRandom(remainingUnpractised),
        setCurrent,
        setSentenceIndex
      );
    } else {
      if (!isFreePracticeMode) setIsFreePracticeMode(true);
      setNextItem(
        pickRandom(vocabularies, current?.id),
        setCurrent,
        setSentenceIndex
      );
    }

    setIsRevealed(false);
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
      {isFreePracticeMode && (
        <p className="text-center text-xs font-medium text-foreground/40 pt-8">
          Done for today — levels won&apos;t change
        </p>
      )}
    </>
  );
}
