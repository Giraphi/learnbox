"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Vocabulary } from "@/app/db";
import type { PoolMode } from "@/app/(home)/components/PractiseView/PoolModeSelector";

type PractiseStateContextValue = {
  current: Vocabulary | null;
  setCurrent: (value: Vocabulary | null) => void;
  sentenceIndex: number;
  setSentenceIndex: (value: number) => void;
  isFreePracticeMode: boolean;
  setIsFreePracticeMode: (value: boolean) => void;
  poolMode: PoolMode;
  setPoolMode: (value: PoolMode) => void;
};

const PractiseStateContext = createContext<PractiseStateContextValue | null>(
  null,
);

type PractiseStateProviderProps = {
  children: ReactNode;
};

export default function PractiseStateProvider({
  children,
}: PractiseStateProviderProps) {
  const [current, setCurrent] = useState<Vocabulary | null>(null);
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isFreePracticeMode, setIsFreePracticeMode] = useState(false);
  const [poolMode, setPoolMode] = useState<PoolMode>("all");

  const value: PractiseStateContextValue = {
    current,
    setCurrent,
    sentenceIndex,
    setSentenceIndex,
    isFreePracticeMode,
    setIsFreePracticeMode,
    poolMode,
    setPoolMode,
  };

  return (
    <PractiseStateContext.Provider value={value}>
      {children}
    </PractiseStateContext.Provider>
  );
}

export function usePractiseState(): PractiseStateContextValue {
  const value = useContext(PractiseStateContext);
  if (!value) {
    throw new Error(
      "usePractiseState must be used inside a PractiseStateProvider",
    );
  }
  return value;
}
