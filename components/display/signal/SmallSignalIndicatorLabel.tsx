import React, { useEffect, useState } from "react";
import { Text, Group } from "@mantine/core";
import { SignalType } from "@/types/signal/Signal";
import { useGetSignalConfig } from "./utils/signal-utils";

export interface SmallSignalIndicatorLabelProps {
  signal: SignalType;
}

export default function SmallSignalIndicatorLabel({
  signal,
}: SmallSignalIndicatorLabelProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 500);
    return () => clearTimeout(timer);
  }, [signal]);

  const config = useGetSignalConfig(signal);
  const IconComponent = config.icon;

  if (signal === SignalType.HOLD) {
    return null;
  }

  return (
    <div
      className={` transition-all duration-200 ${
        isAnimating ? "animate-fade-in" : ""
      }`}
    >
      <div
        className={`flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-default select-none px-2 py-0 text-base rounded-lg border shadow-sm ${config.classes}`}
      >
        <Group gap="xs" justify="center" align="center">
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full ${config.iconGradient} shadow-lg flex items-center justify-center`}
            >
              <IconComponent size={12} className="text-white" />
            </div>
          </div>

          <Text size="xs" fw={700} className="tracking-wide">
            {config.text}
          </Text>
        </Group>
      </div>
    </div>
  );
}
