import React from "react";
import { Text, Indicator, Group } from "@mantine/core";
import { IconCategory } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function EmptySignalIndicator() {
  const t = useTranslations();

  return (
    <Indicator
      className="w-full h-full"
      inline
      processing
      color="gray"
      offset={2}
      size={30}
      withBorder
      position="top-start"
      disabled={true}
    >
      <div className="w-full h-full transition-all duration-200">
        <div className="w-full h-full flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-default select-none px-4 py-2 text-base rounded-lg border shadow-sm bg-gray-50 border-gray-300 text-gray-800">
          <Group gap="md" justify="center" align="center">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 shadow-lg flex items-center justify-center">
                <IconCategory size={24} className="text-white" />
              </div>
            </div>

            <Text size="md" fw={700} className="tracking-wide">
              {t("No Signal")}
            </Text>
          </Group>
        </div>
      </div>
    </Indicator>
  );
}
