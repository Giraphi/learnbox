import { useState } from "react";
import { motion } from "motion/react";
import { Check, Eye, XCircle } from "lucide-react";
import type { Vocabulary } from "@/app/db";

type PractiseCardProps = {
  vocabulary: Vocabulary;
  sentenceIndex: number;
  onPass: () => void;
  onFail: () => void;
};

function censorWord(sentence: string, word: string): string {
  return sentence.replace(new RegExp(word, "gi"), (match) =>
    "_".repeat(Math.floor(match.length * 0.8 + 1)),
  );
}

export default function PractiseCard({
  vocabulary,
  sentenceIndex,
  onPass,
  onFail,
}: PractiseCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  const exampleSentence = vocabulary.exampleSentences?.[sentenceIndex] ?? null;
  const censoredSentence = exampleSentence
    ? censorWord(exampleSentence, vocabulary.english)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="flex w-full max-w-sm flex-col gap-2 rounded-2xl border border-foreground/15 bg-foreground/3 p-6 min-h-[260px] justify-between"
    >
      <p className="text-center text-2xl font-semibold tracking-tight">
        {vocabulary.german}
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
        {vocabulary.english}
      </p>

      <div className="flex justify-between justify-self-end">
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
