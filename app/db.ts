import Dexie, { type EntityTable } from "dexie";

type Vocabulary = {
  id: string;
  english: string;
  german: string;
  level: number;
  lastLevelChange: Date;
  exampleSentences: string[];
};

const db = new Dexie("LearnboxDB") as Dexie & {
  vocabularies: EntityTable<Vocabulary, "id">;
};

db.version(1).stores({
  vocabularies: "id, level",
});

db.on("populate", (transaction) => {
  transaction.table("vocabularies").bulkAdd([
    {
      id: "1",
      english: "stroller",
      german: "Kinderwagen",
      level: 1,
      lastLevelChange: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      exampleSentences: [
        "She pushed the stroller through the park.",
        "We need a new stroller for the baby.",
        "He folded the stroller and put it in the car.",
        "The stroller had a sunshade to protect the child.",
        "They walked along the river with the stroller.",
      ],
    },
    {
      id: "2",
      english: "reckless",
      german: "rücksichtslos",
      level: 1,
      lastLevelChange: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      exampleSentences: [
        "The reckless driver ignored the red light.",
        "It was reckless to swim in the stormy sea.",
        "His reckless behavior put everyone at risk.",
        "She made a reckless decision without thinking.",
        "The company was fined for its reckless handling of waste.",
      ],
    },
    {
      id: "3",
      english: "irresponsible",
      german: "unverantwortlich",
      level: 1,
      lastLevelChange: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      exampleSentences: [
        "It would be irresponsible to leave a child alone.",
        "His irresponsible spending left him in debt.",
        "The report called the decision irresponsible.",
        "She felt irresponsible for forgetting the appointment.",
        "Ignoring safety rules is irresponsible.",
      ],
    },
    {
      id: "4",
      english: "deliberate",
      german: "absichtlich",
      level: 1,
      lastLevelChange: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      exampleSentences: [
        "That was a deliberate attempt to mislead us.",
        "She made a deliberate choice to stay quiet.",
        "The damage was deliberate, not accidental.",
        "He took a deliberate step forward.",
        "It was a deliberate act of kindness.",
      ],
    },
  ]);
});

export { db };
export type { Vocabulary };
