"use client";

import { useState, useId } from "react";
import { db } from "@/app/db";
import {
  translateToGerman,
  type TranslationToGermanResult,
} from "@/app/vocabulary/utils";
import Spinner from "@/components/Spinner";

type InputEnglishProps = {
  onAdd: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export default function InputEnglish({ onAdd, inputRef }: InputEnglishProps) {
  const [english, setEnglish] = useState("");
  const [translationResult, setTranslationResult] =
    useState<TranslationToGermanResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const englishId = useId();

  async function handleTranslate(event: React.FormEvent) {
    event.preventDefault();
    if (!english.trim() || isTranslating) return;

    setIsTranslating(true);
    setTranslationResult(null);

    const result = await translateToGerman(english);
    setTranslationResult(result);
    setIsTranslating(false);
  }

  async function handleSelectGerman(germanWord: string) {
    if (!translationResult || translationResult.status !== "success") return;

    await db.vocabularies.add({
      id: crypto.randomUUID(),
      english: english.trim(),
      german: germanWord,
      level: 1,
      lastLevelChange: { date: new Date(), change: "none" },
      exampleSentences: translationResult.output.englishExampleSentences,
    });
    onAdd();
  }

  return (
    <>
      <form onSubmit={handleTranslate} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={englishId} className="text-xs text-foreground/60">
            English
          </label>
          <input
            ref={inputRef}
            id={englishId}
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="e.g. apple"
            className="rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-foreground/40 focus:border-foreground/40"
          />
        </div>

        <button
          type="submit"
          disabled={!english.trim() || isTranslating}
          className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          {isTranslating ? "Translating…" : "Translate"}
        </button>
      </form>

      {isTranslating && (
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-foreground/50">
          <Spinner size="14" />
          <span>Looking up translations…</span>
        </div>
      )}

      {translationResult?.status === "no_translation" && (
        <p className="mt-4 text-center text-sm text-foreground/50">
          No translation found. Check the spelling and try again.
        </p>
      )}

      {translationResult?.status === "success" &&
        translationResult.output.englishExampleSentences.length > 0 && (
          <div className="flex flex-col gap-1.5 rounded-lg border border-foreground/10 px-3 py-2.5 mt-4">
            <p className="text-xs font-medium text-foreground/60">
              Example sentences
            </p>
            <ul className="flex list-inside list-disc flex-col gap-1">
              {translationResult.output.englishExampleSentences
                .slice(0, 3)
                .map((sentence, sentenceIndex) => (
                  <li
                    key={sentenceIndex}
                    className="text-xs leading-relaxed text-foreground/50"
                  >
                    {sentence}
                  </li>
                ))}
            </ul>
          </div>
        )}

      {translationResult?.status === "success" && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-xs text-foreground/60">
            Pick a German translation to add:
          </p>
          {translationResult.output.germanSuggestions.map((germanWord) => (
            <button
              key={germanWord}
              type="button"
              onClick={() => handleSelectGerman(germanWord)}
              className="rounded-lg border border-foreground/15 px-4 py-3 text-left text-sm font-medium transition-colors hover:bg-foreground/5"
            >
              {germanWord}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
