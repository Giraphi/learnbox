"use server";

import { generateText, Output } from "ai";
import dedent from "dedent";
import { z } from "zod/v4";

const translationSchema = z.object({
  candidate: z.string(),
  exampleSentences: z.array(z.string()),
});

export type Translation = z.infer<typeof translationSchema>;

export type TranslationResult =
  | { status: "success"; translations: Translation[] }
  | { status: "no_translation" };

export async function translateToEnglish(
  germanWord: string,
): Promise<TranslationResult> {
  const trimmed = germanWord.trim();
  if (!trimmed) return { status: "no_translation" };

  const { output } = await generateText({
    model: "openai/gpt-4.1-mini",
    output: Output.array({
      element: translationSchema,
    }),
    prompt: dedent`   
    You are a translation helper you receive the following English word or phrase: "${trimmed}". 

    Translate the input German word or phrase to English. In case there are multiple possible translations, return up to 3 translation candidates sorted by relevance, but stick to one translation if that one is really matching the German meaning. For each translation candidate, also provide exactly 10 short, simple example sentences using that English word or phrase in a way that matches the German meaning. Try to make the sentences as diverse as possible. If the German input is misspelled or not a real word or phrase, return an empty array."
    `,
  });

  if (!output || output.length === 0) return { status: "no_translation" };

  return { status: "success", translations: output };
}

export async function translateToGerman(
  englishWord: string,
): Promise<TranslationResult> {
  const trimmed = englishWord.trim();
  if (!trimmed) return { status: "no_translation" };

  // EN -> GER

  const { output } = await generateText({
    model: "openai/gpt-4.1-mini",
    output: Output.array({
      element: translationSchema,
    }),
    prompt: dedent`
    You are a translation helper you receive the following English word or phrase: "${trimmed}". 

    Translate the input English word or phrase to German. In case there are multiple possible translations, return up to 3 translation candidats sorted by relevance, but stick to one translation if that one is really matching the English meaning. For each translation candidate, also provide exactly 10 short, simple example sentences in English using the english input phrase such that it could be translated to the German candidate. Try to make the sentences as diverse as possible. If the English input is misspelled or not a real word or phrase, return an empty array."
 `,
  });

  if (!output) return { status: "no_translation" };

  return { status: "success", translations: output };
}
