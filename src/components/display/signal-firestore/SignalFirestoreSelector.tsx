"use client";

import { Group, SegmentedControl, Indicator, Stack } from "@mantine/core";
import { IconBroadcast } from "@tabler/icons-react";
import { SignalTimeframe, SignalType } from "@/types/signal/FireStoreSignal";

interface TimeframeOption {
  label: string;
  value: SignalTimeframe;
}

interface SignalTypeOption {
  label: string;
  value: SignalType;
}

interface SignalFirestoreSelectorProps {
  selectedTimeframe: SignalTimeframe;
  selectedSignalType: SignalType;
  onTimeframeChange: (timeframe: SignalTimeframe) => void;
  onSignalTypeChange: (signalType: SignalType) => void;
  timeframeOptions: TimeframeOption[];
  signalTypeOptions: SignalTypeOption[];
}

export default function SignalFirestoreSelector({
  selectedTimeframe,
  selectedSignalType,
  onTimeframeChange,
  onSignalTypeChange,
  timeframeOptions,
  signalTypeOptions,
}: SignalFirestoreSelectorProps) {
  return (
    <Stack
      gap="sm"
      className="flex-shrink-0 bg-gray-500 py-2 px-2 rounded-tl-md rounded-tr-md"
    >
      {/* Selection Controls with Live Indicator */}
      <Group gap="xs" wrap="nowrap" justify="space-between" align="center">
        <Group gap="xs">
          <Indicator
            processing
            color="green.5"
            size={10}
            position="top-start"
            offset={4}
          >
            <IconBroadcast
              size={24}
              className="text-orange-300 animate-pulse"
            />
          </Indicator>
        </Group>

        <Group gap="xs" wrap="nowrap">
          {/* Timeframe Selector */}
          <SegmentedControl
            value={selectedTimeframe}
            onChange={(value) => onTimeframeChange(value as SignalTimeframe)}
            data={timeframeOptions}
            size="xs"
            color="orange"
            className="flex-shrink-0"
          />

          {/* Signal Type Selector */}
          <SegmentedControl
            value={selectedSignalType}
            onChange={(value) => onSignalTypeChange(value as SignalType)}
            data={signalTypeOptions}
            size="xs"
            color="blue"
            className="flex-shrink-0"
          />
        </Group>
      </Group>
    </Stack>
  );
}
