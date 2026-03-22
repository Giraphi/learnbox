"use client";

import { useRef, useState, useId, useEffect } from "react";
import { db } from "@/app/db";

type AddVocabularyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddVocabularyDialog({
  isOpen,
  onClose,
}: AddVocabularyDialogProps) {
  const [english, setEnglish] = useState("");
  const [german, setGerman] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const englishId = useId();
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
    setEnglish("");
    setGerman("");
    onClose();
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedEnglish = english.trim();
    const trimmedGerman = german.trim();
    if (!trimmedEnglish || !trimmedGerman) return;

    await db.vocabularies.add({
      id: crypto.randomUUID(),
      english: trimmedEnglish,
      german: trimmedGerman,
      level: 1,
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            className="rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-foreground/40 focus:border-foreground/40"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={englishId} className="text-xs text-foreground/60">
            English
          </label>
          <input
            id={englishId}
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="e.g. apple"
            autoFocus
            className="rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-foreground/40 focus:border-foreground/40"
          />
        </div>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-lg border border-foreground/15 px-4 py-2.5 text-sm transition-colors hover:bg-foreground/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!english.trim() || !german.trim()}
            className="flex-1 rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </form>
    </dialog>
  );
}
