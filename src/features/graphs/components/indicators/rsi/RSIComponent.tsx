import { Button, Tooltip, ThemeIcon } from "@mantine/core";
import { useRSITabQuery } from "@/features/graphs/hooks/indicators/rsi/useRSITabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconTrendingUp } from "@tabler/icons-react";
import { RSISettingsModal } from "./RSISettingsModal";

export function RSIComponent() {
  const { showRSI, setShowRSI, rsiConfig, updatePeriod } = useRSITabQuery();
  const t = useTranslations();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Tooltip label={t("RSI Settings")}>
        <Button
          variant="subtle"
          p={2}
          size="xs"
          onClick={() => setOpened(true)}
        >
          <ThemeIcon color="rsi.4" size="sm">
            <IconTrendingUp size={16} />
          </ThemeIcon>
        </Button>
      </Tooltip>

      <RSISettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        rsiConfig={rsiConfig}
        showRSI={showRSI}
        updateEnabled={(value) => setShowRSI(value)}
        updatePeriod={updatePeriod}
        size="sm"
      />
    </>
  );
}
