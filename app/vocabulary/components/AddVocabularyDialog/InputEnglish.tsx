"use client";

import { useState, useId } from "react";
import { db } from "@/app/db";
import {
  translateToGerman,
  type Translation,
  type TranslationResult,
} from "@/app/vocabulary/utils";
import Spinner from "@/components/Spinner";

type InputEnglishProps = {
  onAdd: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
};

export default function InputEnglish({ onAdd, inputRef }: InputEnglishProps) {
  const [english, setEnglish] = useState("");
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
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

  async function handleAddTranslation(translation: Translation) {
    await db.vocabularies.add({
      id: crypto.randomUUID(),
      english: english.trim(),
      german: translation.candidate,
      level: 1,
      lastLevelChange: { date: new Date(), change: "none" },
      exampleSentences: translation.exampleSentences,
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

      {translationResult?.status === "success" && (
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-xs text-foreground/60">
            Pick a translation to add:
          </p>
          {translationResult.translations.map((translation) => (
            <button
              key={translation.candidate}
              type="button"
              onClick={() => handleAddTranslation(translation)}
              className="rounded-lg border border-foreground/15 px-4 py-3 text-left transition-colors hover:bg-foreground/5"
            >
              <span className="text-sm font-medium">
                {translation.candidate}
              </span>
              {translation.exampleSentences[0] && (
                <span className="mt-0.5 block text-xs text-foreground/50">
                  {translation.exampleSentences[0]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
