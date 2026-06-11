import { motion } from "motion/react";

type CensoredSentenceProps = {
  sentence: string;
  word: string;
};

export default function CensoredSentence({
  sentence,
  word,
}: CensoredSentenceProps) {
  const parts = sentence.split(new RegExp(`(${word})`, "gi"));

  return (
    <>
      {parts.map((part, index) => {
        if (part.toLowerCase() !== word.toLowerCase()) {
          return <span key={index}>{part}</span>;
        }

        return (
          <motion.span
            key={index}
            className="mx-1 inline-block h-[0.8em] w-[2em] rounded-[0.2em] bg-foreground/40 align-middle"
            animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.92, 1, 0.92] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}
    </>
  );
}
