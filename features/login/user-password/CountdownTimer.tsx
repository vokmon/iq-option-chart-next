"use client";

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Text } from "@mantine/core";
import { useTranslations } from "next-intl";

type CountdownTimerProps = {
  initialSeconds?: number;
  onComplete?: () => void;
  onReset?: () => void;
};

export type CountdownTimerRef = {
  reset: () => void;
};

const CountdownTimer = forwardRef<CountdownTimerRef, CountdownTimerProps>(
  ({ initialSeconds = 58, onComplete, onReset }, ref) => {
    const [countdown, setCountdown] = useState<number>(initialSeconds);
    const [isActive, setIsActive] = useState<boolean>(true);
    const t = useTranslations();

    useEffect(() => {
      let interval: NodeJS.Timeout;

      if (isActive && countdown > 0) {
        interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              setIsActive(false);
              onComplete?.();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }, [countdown, isActive, onComplete]);

    const reset = () => {
      setCountdown(initialSeconds);
      setIsActive(true);
      onReset?.();
    };

    useImperativeHandle(ref, () => ({
      reset,
    }));

    if (!isActive) {
      return null;
    }

    return (
      <Text
        c="white"
        size="sm"
        fw={500}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {t("Resend In")} {countdown}s
      </Text>
    );
  }
);

CountdownTimer.displayName = "CountdownTimer";

export default CountdownTimer;
