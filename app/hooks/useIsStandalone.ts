"use client";

import { useSyncExternalStore } from "react";

const EMPTY_SUBSCRIBE = () => () => {};

export function useIsStandalone() {
  return useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false
  );
}
