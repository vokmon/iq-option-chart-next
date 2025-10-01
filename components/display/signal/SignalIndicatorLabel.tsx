import React, { useEffect, useState } from "react";
import { Text, Indicator, Group } from "@mantine/core";
import { SignalType } from "@/types/signal/Signal";
import { useTranslations } from "next-intl";
import { useGetSignalConfig } from "./utils/signal-utils";

export interface SignalIndicatorLabelProps {
  signal: SignalType;
}

export default function SignalIndicatorLabel({
  signal,
}: SignalIndicatorLabelProps) {
  const t = useTranslations();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [signal]);

  const config = useGetSignalConfig(signal);
  const IconComponent = config.icon;

  return (
    <Indicator
      className="w-full h-full"
      inline
      processing
      color={config.color}
      offset={2}
      size={30}
      withBorder
      position="top-start"
      disabled={signal === SignalType.HOLD}
    >
      <div
        className={`w-full h-full transition-all duration-200 ${
          isAnimating ? "animate-fade-in" : ""
        }`}
      >
        <div
          className={`w-full h-full flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-default select-none px-4 py-2 text-base rounded-lg border shadow-sm ${config.classes}`}
        >
          <Group gap="md" justify="center" align="center">
            <div className="relative">
              <div
                className={`w-10 h-10 rounded-full ${config.iconGradient} shadow-lg flex items-center justify-center`}
              >
                <IconComponent size={24} className="text-white" />
              </div>
            </div>

            <Text size="md" fw={700} className="uppercase tracking-wide">
              {config.text}
              {(signal === SignalType.CALL || signal === SignalType.PUT) && (
                <span className="normal-case font-medium ml-2 opacity-80">
                  {t("Resistance zone")}
                </span>
              )}
            </Text>
          </Group>
        </div>
      </div>
    </Indicator>
  );
}
