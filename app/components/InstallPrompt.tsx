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

const EMPTY_SUBSCRIBE = () => () => {};

export default function InstallPrompt() {
  const installPrompt = useSyncExternalStore(
    subscribeInstallPrompt,
    () => deferredPrompt,
    () => null
  );
  const isIOS = useSyncExternalStore(
    EMPTY_SUBSCRIBE,
    () =>
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window),
    () => false
  );

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
      <h3>Install the App on your device to get started</h3>
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
        >
          Add to Home Screen
        </button>
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
