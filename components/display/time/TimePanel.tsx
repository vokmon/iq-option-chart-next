"use client";
import { useSdk } from "@/hooks/useSdk";
import { Text, Group, ThemeIcon } from "@mantine/core";
import { IconClock } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { formatDateTime } from "@/utils/dateTime";

export default function TimePanel() {
  const { sdk } = useSdk();
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    if (sdk) {
      sdk.subscribeOnWsCurrentTime((currentTime) => {
        setCurrentTime(currentTime);
      });
    }
    return () => {
      if (sdk) {
        sdk.unsubscribeOnWsCurrentTime((currentTime) => {
          setCurrentTime(currentTime);
        });
      }
    };
  }, [sdk]);

  return (
    <div className="flex items-center justify-center px-3 py-2 rounded-xl transition-all duration-200 hover:shadow-lg backdrop-blur-sm bg-white/10 border border-white/20 shadow-lg">
      <Group gap="xs" align="center">
        <ThemeIcon
          size="sm"
          radius="sm"
          variant="light"
          color="blue"
          className="flex-shrink-0"
        >
          <IconClock size={14} />
        </ThemeIcon>
        <Text
          size="sm"
          fw={500}
          c="white"
          className="font-mono tracking-wide drop-shadow-sm"
        >
          {currentTime ? formatDateTime(currentTime) : "Loading..."}
        </Text>
      </Group>
    </div>
  );
}
