"use server";

import { generateText, Output } from "ai";
import { z } from "zod/v4";
const translationSchema = z.object({
  english: z.string(),
  exampleSentences: z.array(z.string()),
});

export type Translation = z.infer<typeof translationSchema>;

export type TranslationResult =
  | { status: "success"; translations: Translation[] }
  | { status: "no_translation" };

export async function translateWord(
  germanWord: string
): Promise<TranslationResult> {
  const trimmed = germanWord.trim();
  if (!trimmed) return { status: "no_translation" };

  const { output } = await generateText({
    model: "google/gemini-2.5-flash-lite",
    output: Output.array({
      element: translationSchema,
    }),
    prompt: `Translate the following German word to English. In case there are multiple possible translations, return up to 3 translations sorted by relevance. For each translation, provide the English word and exactly 5 short, simple example sentences using that English word in a way that matches the German meaning. If the German word is misspelled or not a real word, return an empty array.\n\nGerman word: "${trimmed}"`,
  });

  if (!output || output.length === 0) return { status: "no_translation" };

  return { status: "success", translations: output };
}

