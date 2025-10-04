"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

interface CountdownTimerProps {
  initialTime: number;
  onComplete: () => void;
  className?: string;
}

export function CountdownTimer({
  initialTime,
  onComplete,
  className = "mt-1 text-xs text-gray-400 dark:text-gray-500",
}: CountdownTimerProps) {
  const [countdown, setCountdown] = useState(initialTime);
  const t = useTranslations();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 0; // Set to 0 instead of calling onComplete here
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialTime]);

  // Separate effect to handle completion when countdown reaches 0
  useEffect(() => {
    if (countdown === 0) {
      onComplete();
    }
  }, [countdown, onComplete]);

  return (
    <p className={className} style={{ minWidth: "200px" }}>
      {t("This prompt will close in {countdown} seconds", { countdown })}
    </p>
  );
}
