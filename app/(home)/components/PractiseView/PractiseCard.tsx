import { useState } from "react";
import { motion } from "motion/react";
import { Check, Eye, XCircle } from "lucide-react";
import type { Vocabulary } from "@/app/db";
import CensoredSentence from "@/app/(home)/components/PractiseView/CensoredSentence";

type PractiseCardProps = {
  vocabulary: Vocabulary;
  sentenceIndex: number;
  onPass: () => void;
  onFail: () => void;
};

export default function PractiseCard({
  vocabulary,
  sentenceIndex,
  onPass,
  onFail,
}: PractiseCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const exampleSentence = vocabulary.exampleSentences?.[sentenceIndex] ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex w-full max-w-sm min-h-[260px] flex-col gap-2 rounded-2xl border border-foreground/15 bg-neutral-900 p-3"
    >
      <div className="relative flex flex-1 items-center justify-center rounded-xl bg-foreground/8 px-4 py-5">
        <p className="text-center text-2xl font-semibold tracking-tight">
          {vocabulary.german}
        </p>
        <p
          className={`absolute inset-x-0 bottom-3 text-center text-base text-foreground/70 ${
            isRevealed ? "visible" : "invisible"
          }`}
        >
          {vocabulary.english}
        </p>
      </div>

      {exampleSentence && (
        <div className="rounded-xl bg-foreground/5 px-4 py-3">
          <p className="text-center text-sm italic text-foreground/70">
            {isRevealed ? (
              exampleSentence
            ) : (
              <CensoredSentence
                sentence={exampleSentence}
                word={vocabulary.english}
              />
            )}
          </p>
        </div>
      )}

      <div className="flex justify-between rounded-xl bg-foreground/2 p-2">
        <button
          onClick={onFail}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/15 transition-colors hover:bg-red-500/10"
          aria-label="Fail"
        >
          <XCircle className="h-5 w-5 text-red-500" strokeWidth={2} />
        </button>

        <button
          onClick={() => setIsRevealed(true)}
          disabled={isRevealed}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/15 transition-colors hover:bg-foreground/5 disabled:opacity-40"
          aria-label="Reveal"
        >
          <Eye className="h-5 w-5" strokeWidth={2} />
        </button>

        <button
          onClick={onPass}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-foreground/15 transition-colors hover:bg-emerald-500/10"
          aria-label="Pass"
        >
          <Check className="h-5 w-5 text-emerald-500" strokeWidth={2} />
        </button>
      </div>
    </motion.div>
  );
}
