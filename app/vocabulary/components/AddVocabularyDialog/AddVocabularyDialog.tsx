"use client";

import { useState, useRef, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import InputGerman from "@/app/vocabulary/components/AddVocabularyDialog/InputGerman";
import InputEnglish from "@/app/vocabulary/components/AddVocabularyDialog/InputEnglish";

type InputMode = "german" | "english";

type AddVocabularyDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AddVocabularyDialog({
  isOpen,
  onClose,
}: AddVocabularyDialogProps) {
  const [inputMode, setInputMode] = useState<InputMode>("german");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.show();
      inputRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  function handleClose() {
    setInputMode("german");
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="fixed inset-0 bottom-16 z-40 m-0 h-auto w-full max-h-none max-w-none bg-neutral-950 text-foreground"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Add Vocabulary</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full p-1.5 transition-colors hover:bg-foreground/10"
            aria-label="Close"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="mb-4 flex rounded-lg border border-foreground/15 p-0.5">
            <button
              type="button"
              onClick={() => setInputMode("german")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                inputMode === "german"
                  ? "bg-foreground text-background"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              German → English
            </button>
            <button
              type="button"
              onClick={() => setInputMode("english")}
              className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                inputMode === "english"
                  ? "bg-foreground text-background"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              English → German
            </button>
          </div>

          {inputMode === "german" ? (
            <InputGerman key="german" onAdd={handleClose} inputRef={inputRef} />
          ) : (
            <InputEnglish
              key="english"
              onAdd={handleClose}
              inputRef={inputRef}
            />
          )}
        </div>
      </div>
    </dialog>
  );
}
