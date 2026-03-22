import Dexie, { type EntityTable } from "dexie";

type Todo = {
  id: string;
  text: string;
};

const db = new Dexie("LearnboxDB") as Dexie & {
  todos: EntityTable<Todo, "id">;
};

db.version(1).stores({
  todos: "id",
});

export { db };
export type { Todo };
