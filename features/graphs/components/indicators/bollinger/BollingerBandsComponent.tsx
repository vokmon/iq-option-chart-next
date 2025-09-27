import { Switch, Group, Button } from "@mantine/core";
import { useBollingerBandsTabQuery } from "@/features/graphs/hooks/indicators/bollinger-bands/useBollingerBandsTabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconSettings } from "@tabler/icons-react";
import { BollingerBandsSettingsModal } from "./BollingerBandsSettingsModal";

interface BollingerBandsComponentProps {
  tabId: string | null;
}

export function BollingerBandsComponent({
  tabId,
}: BollingerBandsComponentProps) {
  const {
    showBollingerBands,
    setShowBollingerBands,
    bollingerConfig,
    updatePeriod,
    updateStdDev,
  } = useBollingerBandsTabQuery(tabId);
  const t = useTranslations();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Group justify="space-between" align="center">
        <Switch
          label={t("Bollinger Bands")}
          checked={showBollingerBands}
          onChange={(event) =>
            setShowBollingerBands(event.currentTarget.checked)
          }
          size="sm"
          color="bollinger.4"
          style={{ flex: 1 }}
        />
        {showBollingerBands && (
          <Button
            variant="subtle"
            size="sm"
            color="bollinger.4"
            leftSection={<IconSettings size={16} />}
            onClick={() => setOpened(true)}
            style={{ flexShrink: 0 }}
          >
            {t("Settings")}
          </Button>
        )}
      </Group>

      <BollingerBandsSettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        bollingerConfig={bollingerConfig}
        updatePeriod={updatePeriod}
        updateStdDev={updateStdDev}
        size="sm"
      />
    </>
  );
}
