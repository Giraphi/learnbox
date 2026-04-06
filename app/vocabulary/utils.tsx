"use server";

import { generateText, Output } from "ai";
import { z } from "zod/v4";

const translationToEnglishSchema = z.object({
  english: z.string(),
  exampleSentences: z.array(z.string()),
});

export type TranslationToEnglish = z.infer<typeof translationToEnglishSchema>;

export type TranslationToEnglishResult =
  | { status: "success"; translations: TranslationToEnglish[] }
  | { status: "no_translation" };

export async function translateToEnglish(
  germanWord: string,
): Promise<TranslationToEnglishResult> {
  const trimmed = germanWord.trim();
  if (!trimmed) return { status: "no_translation" };
  console.log("##### Calling Google Gemini API...");

  const { output } = await generateText({
    model: "google/gemini-2.5-flash-lite",
    output: Output.array({
      element: translationToEnglishSchema,
    }),
    prompt: `   
    Translate the following German word to English. In case there are multiple possible translations, return up to 3 translations sorted by relevance, but stick to one translation if that one is really matching the German meaning. For each translation, provide the English word and exactly 5 short, simple example sentences using that English word in a way that matches the German meaning. If the German word is misspelled or not a real word, return an empty array.\n\nGerman word: "${trimmed}"`,
  });

  if (!output || output.length === 0) return { status: "no_translation" };

  return { status: "success", translations: output };
}

const translationToGermanSchema = z.object({
  germanSuggestions: z.array(z.string()),
  englishExampleSentences: z.array(z.string()),
});

export type TranslationToGerman = z.infer<typeof translationToGermanSchema>;

export type TranslationToGermanResult =
  | { status: "success"; output: TranslationToGerman }
  | { status: "no_translation" };

export async function translateToGerman(
  englishWord: string,
): Promise<TranslationToGermanResult> {
  const trimmed = englishWord.trim();
  if (!trimmed) return { status: "no_translation" };
  console.log("##### Calling Google Gemini API...");

  const { output } = await generateText({
    model: "google/gemini-2.5-flash-lite",
    output: Output.object({
      schema: translationToGermanSchema,
    }),
    prompt: `
       You are a translation helper you receive the following English word: "${trimmed}". 
   Translate the English word to German. In case there are multiple possible translations, return up to 3 translations sorted by relevance, but stick to one translation if that one is really matching the German meaning. 
   Additionally, for the english word, provide exactly 5 short, simple example sentences using that English word in a way that matches the German meaning. If the English word is misspelled or not a real word, return an empty array.   
 `,
  });

  if (!output) return { status: "no_translation" };

  return { status: "success", output };
}
