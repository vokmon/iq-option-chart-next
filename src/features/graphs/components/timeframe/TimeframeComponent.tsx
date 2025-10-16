import { Button, ThemeIcon, Tooltip } from "@mantine/core";
import { useTimeframeTabQuery } from "@/features/graphs/hooks/timeframe/useTimeframeTabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconClock } from "@tabler/icons-react";
import { TimeframeSettingsModal } from "@/features/graphs/components/timeframe/TimeframeSettingsModal";

export function TimeframeComponent() {
  const { timeframeInMinute, updateTimeframe } = useTimeframeTabQuery();
  const t = useTranslations();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Tooltip label={t("Timeframe")}>
        <Button
          variant="subtle"
          p={2}
          size="xs"
          onClick={() => setOpened(true)}
        >
          <ThemeIcon color="orange" size="sm">
            <IconClock size={16} />
          </ThemeIcon>
        </Button>
      </Tooltip>

      <TimeframeSettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        timeframeInMinute={timeframeInMinute}
        updateTimeframe={updateTimeframe}
        size="sm"
      />
    </>
  );
}
