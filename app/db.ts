import Dexie, { type EntityTable } from "dexie";

type Vocabulary = {
  id: string;
  english: string;
  german: string;
  level: number;
};

const db = new Dexie("LearnboxDB") as Dexie & {
  vocabularies: EntityTable<Vocabulary, "id">;
};

db.version(1).stores({
  vocabularies: "id, level",
});

db.on("populate", (transaction) => {
  transaction.table("vocabularies").bulkAdd([
    { id: "1", english: "stroller", german: "Kinderwagen", level: 1 },
    { id: "2", english: "reckless", german: "rücksichtslos", level: 1 },
    { id: "3", english: "irresponsible", german: "unverantwortlich", level: 1 },
    { id: "4", english: "deliberate", german: "absichtlich", level: 1 },
  ]);
});

export { db };
export type { Vocabulary };
