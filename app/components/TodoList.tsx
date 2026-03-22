"use client";

import { useState, useSyncExternalStore, useId } from "react";

type Todo = {
  id: string;
  text: string;
};

const STORAGE_KEY = "learnbox-todos";

function getTodosFromStorage(): Todo[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

function saveTodosToStorage(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  notifyListeners();
}

const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);

  function handleStorageEvent(event: StorageEvent) {
    if (event.key === STORAGE_KEY) callback();
  }
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

let cachedSnapshot: Todo[] = [];
let cachedRaw: string | null = null;

function getSnapshot(): Todo[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = raw ? JSON.parse(raw) : [];
  }
  return cachedSnapshot;
}

const SERVER_SNAPSHOT: Todo[] = [];

export default function TodoList() {
  const [inputValue, setInputValue] = useState("");
  const formId = useId();
  const todos = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => SERVER_SNAPSHOT
  );

  function handleAddTodo(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTodo: Todo = { id: crypto.randomUUID(), text: trimmed };
    saveTodosToStorage([...getTodosFromStorage(), newTodo]);
    setInputValue("");
  }

  function handleDeleteTodo(todoId: string) {
    const updated = getTodosFromStorage().filter((todo) => todo.id !== todoId);
    saveTodosToStorage(updated);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <label htmlFor={formId} className="sr-only">
          New todo
        </label>
        <input
          id={formId}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 rounded-lg border border-foreground/15 bg-transparent px-4 py-2.5 text-sm outline-none placeholder:text-foreground/40 focus:border-foreground/40"
        />
        <button
          type="submit"
          className="rounded-lg bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40"
          disabled={inputValue.trim().length === 0}
        >
          Add
        </button>
      </form>

      {todos.length === 0 ? (
        <p className="text-center text-sm text-foreground/40">
          No todos yet. Add one above!
        </p>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="group flex items-center justify-between rounded-lg border border-foreground/10 px-4 py-3"
            >
              <span className="text-sm">{todo.text}</span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="rounded-md px-2 py-1 text-xs text-foreground/40 transition-colors hover:bg-foreground/10 hover:text-foreground"
                aria-label={`Delete "${todo.text}"`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
