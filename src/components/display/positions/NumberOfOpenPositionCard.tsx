"use client";
import { useAnimationTrigger } from "@/components/ui/hooks/useAnimationTrigger";
import { Group, Text } from "@mantine/core";
import { IconCashBanknote } from "@tabler/icons-react";

interface NumberOfOpenPositionCardProps {
  number: number;
}

export default function NumberOfOpenPositionCard({
  number,
}: NumberOfOpenPositionCardProps) {
  const isAnimating = useAnimationTrigger(number);

  return (
    <div
      className={`animate-pulse transition-all duration-200 ${
        isAnimating ? "animate-fade-in" : ""
      }`}
    >
      <div
        className={`flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-default select-none px-2 py-0 text-base rounded-lg border shadow-sm bg-purple-50 border-purple-300 text-purple-800`}
      >
        <Group gap="xs" justify="center" align="center">
          <div className="relative">
            <div
              className={`w-6 h-4 rounded-full  shadow-lg flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600 `}
            >
              <IconCashBanknote size={13} className="text-white" />
            </div>
          </div>

          <Text size="xs" fw={700} className="tracking-wide">
            {number > 99 ? "99+" : number}
          </Text>
        </Group>
      </div>
    </div>
  );
}
