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

export { db };
export type { Vocabulary };
