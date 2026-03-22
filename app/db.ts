import Dexie, { type EntityTable } from "dexie";

type Vocabulary = {
  id: string;
  english: string;
  german: string;
};

const db = new Dexie("LearnboxDB") as Dexie & {
  vocabularies: EntityTable<Vocabulary, "id">;
};

db.version(1).stores({
  vocabularies: "id",
});

db.on("populate", (transaction) => {
  transaction.table("vocabularies").bulkAdd([
    { id: "1", english: "stroller", german: "Kinderwagen" },
    { id: "2", english: "reckless", german: "rücksichtslos" },
    { id: "3", english: "irresponsible", german: "unverantwortlich" },
    { id: "4", english: "deliberate", german: "absichtlich" },
  ]);
});

export { db };
export type { Vocabulary };
