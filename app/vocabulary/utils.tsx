"use server";

import { generateText, Output } from "ai";
import { z } from "zod/v4";

const translationSchema = z.object({
  translation: z.string(),
  targetLanguage: z.enum(["de", "en"]),
  exampleSentences: z.array(z.string()),
});

export type Translation = z.infer<typeof translationSchema>;

export type TranslationResult =
  | { status: "success"; translations: Translation[] }
  | { status: "no_translation" };

export async function translateWord(
  inputWord: string
): Promise<TranslationResult> {
  const trimmed = inputWord.trim();
  if (!trimmed) return { status: "no_translation" };
  console.log("##### Calling Google Gemini API...");

  const { output } = await generateText({
    model: "google/gemini-2.5-flash-lite",
    output: Output.array({
      element: translationSchema,
    }),
    prompt: `
You are a translation helper and you are given the following input word: "${trimmed}"    
    First: Detect if the input word is German or English. In the output set the targetLanguage to "de" if it is German, otherwise set it to "en". If it is German proceed with Task 1, otherwise proceed with Task 2.

    Task 1: (for German input word): Translate the input word to English. In case there are multiple possible translations, return up to 3 translations sorted by relevance, but stick to one translation if that one is really matching the meaning. For each translation, provide the english word and exactly 5 short, simple example sentences in english, using that word in a way that matches the input word's meaning. If the input word word is misspelled or not a real word, return an empty array. 


  `,
  });

  if (!output || output.length === 0) return { status: "no_translation" };

  return { status: "success", translations: output };
}
