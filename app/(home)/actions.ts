"use server";

import { generateText } from "ai";

export async function generateExampleSentence(
  englishWord: string
): Promise<string> {
  const { text } = await generateText({
    model: "google/gemini-2.5-flash-lite",
    prompt: `Write one short, simple English sentence using the word "${englishWord}". Replace "${englishWord}" with "___" in the sentence. Only return the sentence, nothing else.`,
  });

  return text.trim();
}
