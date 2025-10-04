import { Group, Tooltip } from "@mantine/core";
import { IconRobot } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export default function SmallAutoTradeLabel() {
  const t = useTranslations();

  return (
    <div className="transition-all duration-200">
      <Tooltip label={t("Auto trading is enabled")}>
        <div
          className={`flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-default select-none px-1 py-0 text-base rounded-lg border shadow-sm bg-blue-50 border-blue-300 text-blue-800`}
        >
          <Group gap="xs" justify="center" align="center">
            <div className="relative">
              <div
                className={`w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 animate-pulse shadow-lg flex items-center justify-center`}
              >
                <IconRobot size={12} className="text-white" />
              </div>
            </div>
          </Group>
        </div>
      </Tooltip>
    </div>
  );
}
