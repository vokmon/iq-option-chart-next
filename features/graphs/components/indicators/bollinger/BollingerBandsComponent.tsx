import { Switch, Group, Button } from "@mantine/core";
import { useBollingerBandsQuery } from "@/features/graphs/hooks/indicators/bollinger-bands/useBollingerBandsQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconSettings } from "@tabler/icons-react";
import { BollingerBandsSettingsModal } from "./BollingerBandsSettingsModal";

export function BollingerBandsComponent() {
  const {
    showBollingerBands,
    setShowBollingerBands,
    bollingerConfig,
    updatePeriod,
    updateStdDev,
  } = useBollingerBandsQuery();
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
          style={{ flex: 1 }}
        />
        {showBollingerBands && (
          <Button
            variant="subtle"
            size="sm"
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
