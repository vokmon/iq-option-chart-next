import { Switch, Group, Button } from "@mantine/core";
import { useRSITabQuery } from "@/features/graphs/hooks/indicators/rsi/useRSITabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconSettings } from "@tabler/icons-react";
import { RSISettingsModal } from "./RSISettingsModal";

export function RSIComponent() {
  const { showRSI, setShowRSI, rsiConfig, updatePeriod } = useRSITabQuery();
  const t = useTranslations();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Group justify="space-between" align="center" className="min-h-[36px]">
        <Switch
          label={t("RSI")}
          checked={showRSI}
          onChange={(event) => setShowRSI(event.currentTarget.checked)}
          size="sm"
          color="rsi.4"
          style={{ flex: 1 }}
        />
        {showRSI && (
          <Button
            variant="subtle"
            size="sm"
            color="rsi.4"
            leftSection={<IconSettings size={16} />}
            onClick={() => setOpened(true)}
            style={{ flexShrink: 0 }}
          >
            {t("Settings")}
          </Button>
        )}
      </Group>

      <RSISettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        rsiConfig={rsiConfig}
        updatePeriod={updatePeriod}
        size="sm"
      />
    </>
  );
}
