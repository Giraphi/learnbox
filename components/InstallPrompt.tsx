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
    <div className="p-8">
      <h3 className="text-lg font-bold pb-8 ">
        Install the App on your phone to get started
      </h3>
      {showInstallButton && (
        <button
          onClick={handleInstallClick}
          className="bg-blue-500 text-white p-2 rounded-md cursor-pointer"
        >
          Add to Home Screen
        </button>
      )}
      {isIOS && (
        <ul className="list-disc list-inside">
          <li>In Safari, tap the three buttons in the bottom</li>
          <li>Tap the share button</li>
          <li>Tap &quot;Add to Home Screen&quot;</li>
        </ul>
      )}
    </div>
  );
}
