"use client";

import { useState, useId, useRef, useCallback } from "react";
import { IoClose } from "react-icons/io5";
import { db } from "@/app/db";
import {
  translateWord,
  type Translation,
  type TranslationResult,
} from "@/app/box/utils";
import Spinner from "@/components/Spinner";

type AddVocabularyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddVocabularyDialog({
  isOpen,
  onClose,
}: AddVocabularyDialogProps) {
  const [german, setGerman] = useState("");
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const germanId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const syncDialog = useCallback(
    (node: HTMLDialogElement | null) => {
      dialogRef.current = node;
      if (!node) return;
      if (isOpen && !node.open) {
        node.show();
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (!isOpen && node.open) node.close();
    },
    [isOpen]
  );

  function handleClose() {
    setGerman("");
    setTranslationResult(null);
    setIsTranslating(false);
    onClose();
  }

  async function handleTranslate(event: React.FormEvent) {
    event.preventDefault();
    if (!german.trim() || isTranslating) return;

    setIsTranslating(true);
    setTranslationResult(null);

    const result = await translateWord(german);
    setTranslationResult(result);
    setIsTranslating(false);
  }

  async function handleAddTranslation(translation: Translation) {
    await db.vocabularies.add({
      id: crypto.randomUUID(),
      english: translation.english,
      german: german.trim(),
      level: 1,
      exampleSentences: translation.exampleSentences,
    });
    handleClose();
  }

  return (
    <dialog
      ref={syncDialog}
      onClose={handleClose}
      className="fixed inset-0 bottom-16 z-40 m-0 h-auto w-full max-h-none max-w-none bg-neutral-950 text-foreground"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Add Vocabulary</h2>
          <button
            type="button"
            tabIndex={-1}
            onClick={handleClose}
            className="rounded-full p-1.5 transition-colors hover:bg-foreground/10"
            aria-label="Close"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <form onSubmit={handleTranslate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor={germanId} className="text-xs text-foreground/60">
                German
              </label>
              <input
                ref={inputRef}
                id={germanId}
                type="text"
                value={german}
                onChange={(e) => setGerman(e.target.value)}
                placeholder="e.g. Apfel"
                className="rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-foreground/40 focus:border-foreground/40"
              />
            </div>

            <button
              type="submit"
              disabled={!german.trim() || isTranslating}
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
                  key={translation.english}
                  type="button"
                  onClick={() => handleAddTranslation(translation)}
                  className="rounded-lg border border-foreground/15 px-4 py-3 text-left transition-colors hover:bg-foreground/5"
                >
                  <span className="text-sm font-medium">
                    {translation.english}
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
        </div>
      </div>
    </dialog>
  );
}
