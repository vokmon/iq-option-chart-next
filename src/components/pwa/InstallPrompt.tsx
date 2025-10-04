"use client";

import { APP_METADATA } from "@/constants/app";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { CountdownTimer } from "./CountdownTimer";
import { Button, Card, Text, Group, Stack, Box } from "@mantine/core";

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

  const handleCountdownComplete = useCallback(() => {
    setShowInstallPrompt(false);
  }, []);

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
    <Box
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 50,
        maxWidth: 384, // max-w-sm equivalent
      }}
    >
      <Card shadow="lg" padding="md" radius="md">
        <Group align="flex-start" gap="sm">
          <Box
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src="/icons/icon.svg"
              alt={`${APP_METADATA.name} icon`}
              width={32}
              height={32}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          <Stack gap="xs" style={{ flex: 1 }}>
            <Text size="sm" fw={500}>
              {t("Install {appName}", { appName: APP_METADATA.name })}
            </Text>
            {isIOS && (
              <Text size="sm" c="dimmed">
                {t("Add this app to your home screen for a better experience")}
              </Text>
            )}
            <CountdownTimer
              initialTime={30}
              onComplete={handleCountdownComplete}
              className="mt-1 text-xs text-gray-400 dark:text-gray-500"
            />
            <Group gap="xs" mt="sm">
              {!isIOS && deferredPrompt && (
                <Button
                  size="xs"
                  onClick={handleInstallClick}
                  variant="filled"
                  color="blue"
                >
                  {t("Install")}
                </Button>
              )}
              {isIOS && (
                <Button
                  size="xs"
                  onClick={() => window.open(window.location.href, "_blank")}
                  variant="filled"
                  color="blue"
                >
                  {t("Open in Safari")}
                </Button>
              )}
              <Button
                size="xs"
                onClick={handleDismiss}
                variant="light"
                color="gray"
              >
                {t("Dismiss")}
              </Button>
            </Group>
          </Stack>
        </Group>
      </Card>
    </Box>
  );
}
