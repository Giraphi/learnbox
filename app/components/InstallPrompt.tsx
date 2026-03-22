"use client";

import { useSyncExternalStore } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event as BeforeInstallPromptEvent;
    notifyListeners();
  });

  window.addEventListener("appinstalled", () => {
    deferredPrompt = null;
    notifyListeners();
  });
}

function subscribeInstallPrompt(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function getInstallPromptSnapshot() {
  return deferredPrompt;
}

const EMPTY_SUBSCRIBE = () => () => {};

function getIsIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window)
  );
}

function getIsStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches;
}

export default function InstallPrompt() {
  const installPrompt = useSyncExternalStore(
    subscribeInstallPrompt,
    getInstallPromptSnapshot,
    () => null
  );
  const isIOS = useSyncExternalStore(EMPTY_SUBSCRIBE, getIsIOS, () => false);
  const isStandalone = useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    getIsStandalone,
    () => false
  );

  if (isStandalone) {
    return null;
  }

  async function handleInstallClick() {
    if (!installPrompt) return;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === "accepted") {
      deferredPrompt = null;
      notifyListeners();
    }
  }

  const showInstallButton = installPrompt !== null;

  return (
    <div>
      <h3>Install App</h3>
      {showInstallButton && (
        <button onClick={handleInstallClick}>Add to Home Screen</button>
      )}
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then &quot;Add to Home Screen&quot;
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}
