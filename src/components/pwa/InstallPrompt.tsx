"use client";

import { APP_METADATA } from "@/constants/app";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CountdownTimer } from "./CountdownTimer";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface NavigatorWithStandalone extends Navigator {
  standalone?: boolean;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    // Check if it's iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    const checkStandalone = () => {
      const standalone = window.matchMedia(
        "(display-mode: standalone)"
      ).matches;
      const isInApp =
        (window.navigator as NavigatorWithStandalone).standalone === true; // iOS Safari
      const isFullscreen = window.matchMedia(
        "(display-mode: fullscreen)"
      ).matches;

      const isInstalled = standalone || isInApp || isFullscreen;
      setIsStandalone(isInstalled);
    };

    // Check immediately
    checkStandalone();

    // Listen for changes in display mode
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    mediaQuery.addEventListener("change", checkStandalone);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      mediaQuery.removeEventListener("change", checkStandalone);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleCountdownComplete = () => {
    setShowInstallPrompt(false);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    // Installation completed
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  // Don't show if no install prompt available and not iOS
  if (!showInstallPrompt && !isIOS) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <Image
                src="/icons/icon.svg"
                alt={`${APP_METADATA.name} icon`}
                width={32}
                height={32}
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {t("Install {appName}", { appName: APP_METADATA.name })}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {isIOS
                ? t("Add this app to your home screen for a better experience")
                : ""}
            </p>
            <CountdownTimer
              initialTime={30}
              onComplete={handleCountdownComplete}
            />
            <div className="mt-3 flex space-x-2">
              {!isIOS && deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
                >
                  {t("Install")}
                </button>
              )}
              {isIOS && (
                <button
                  onClick={() => window.open(window.location.href, "_blank")}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
                >
                  {t("Open in Safari")}
                </button>
              )}
              <button
                onClick={handleDismiss}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
              >
                {t("Dismiss")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
