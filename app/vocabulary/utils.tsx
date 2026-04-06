"use server";

import { generateText, Output } from "ai";
import dedent from "dedent";
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
    model: "openai/gpt-4.1-mini",
    output: Output.array({
      element: translationToEnglishSchema,
    }),
    prompt: dedent`   
    You are a translation helper you receive the following English word or phrase: "${trimmed}". 

    Translate the input German word or phrase to English. In case there are multiple possible translations, return up to 3 translations sorted by relevance, but stick to one translation if that one is really matching the German meaning. For each translation, provide the English word or phrase and exactly 5 short, simple example sentences using that English word or phrase in a way that matches the German meaning. If the German input is misspelled or not a real word or phrase, return an empty array."
    `,
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
    model: "openai/gpt-4.1-mini",
    output: Output.object({
      schema: translationToGermanSchema,
    }),
    prompt: dedent`
    You are a translation helper you receive the following English word or phrase: "${trimmed}". 

    Translate the input English word or phrase to German. In case there are multiple possible translations, return up to 3 translations sorted by relevance, but stick to one translation if that one is really matching the German meaning. 

    Additionally, for the English word or phrase, provide exactly 5 short, simple example sentences using that English word or phrase in a way that matches the German meaning. If the English word or phrase is misspelled or not a real word or phrase, return an empty array.   
 `,
  });

  if (!output) return { status: "no_translation" };

  return { status: "success", output };
}
