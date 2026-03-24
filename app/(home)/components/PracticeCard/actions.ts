"use server";

import { generateText } from "ai";

type ExampleSentenceResult = {
  censored: string;
  uncensored: string;
};

export async function generateExampleSentence(
  englishWord: string,
  germanWord: string
): Promise<ExampleSentenceResult> {
  const { text } = await generateText({
    model: "google/gemini-2.5-flash-lite",
    prompt: `Write one short, simple English sentence using the word "${englishWord}". Only return the sentence, nothing else. Make that  "${englishWord}" in this sentences can be translated to "${germanWord}".`,
  });

  const uncensored = text.trim();
  const censored = uncensored.replace(new RegExp(englishWord, "gi"), (match) =>
    "_".repeat(Math.floor(match.length * 0.8 + 1))
  );

  return { censored, uncensored };
}
