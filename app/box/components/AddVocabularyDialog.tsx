"use client";

import { useRef, useState, useId, useEffect } from "react";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const germanId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function handleClose() {
    dialogRef.current?.close();
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
      ref={dialogRef}
      onClose={handleClose}
      className="w-full max-w-sm rounded-xl border border-foreground/15 bg-background p-6 text-foreground"
    >
      <h2 className="mb-4 text-lg font-semibold">Add Vocabulary</h2>

      <form onSubmit={handleTranslate} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={germanId} className="text-xs text-foreground/60">
            German
          </label>
          <input
            id={germanId}
            type="text"
            value={german}
            onChange={(e) => setGerman(e.target.value)}
            placeholder="e.g. Apfel"
            autoFocus
            className="rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-foreground/40 focus:border-foreground/40"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg border border-foreground/15 px-4 py-2.5 text-sm transition-colors hover:bg-foreground/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!german.trim() || isTranslating}
            className="flex-1 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            {isTranslating ? "Translating…" : "Translate"}
          </button>
        </div>
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
              <span className="text-sm font-medium">{translation.english}</span>
              {translation.exampleSentences[0] && (
                <span className="mt-0.5 block text-xs text-foreground/50">
                  {translation.exampleSentences[0]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </dialog>
  );
}
