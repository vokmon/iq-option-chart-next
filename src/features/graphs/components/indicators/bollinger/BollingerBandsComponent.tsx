import { Button, ThemeIcon, Tooltip } from "@mantine/core";
import { useBollingerBandsTabQuery } from "@/features/graphs/hooks/indicators/bollinger-bands/useBollingerBandsTabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconChartLine } from "@tabler/icons-react";
import { BollingerBandsSettingsModal } from "./BollingerBandsSettingsModal";

export function BollingerBandsComponent() {
  const {
    showBollingerBands,
    setShowBollingerBands,
    bollingerConfig,
    updatePeriod,
    updateStdDev,
  } = useBollingerBandsTabQuery();
  const t = useTranslations();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Tooltip label={t("Bollinger Bands Settings")}>
        <Button
          variant="subtle"
          p={2}
          size="xs"
          onClick={() => setOpened(true)}
        >
          <ThemeIcon color="bollinger.4" size="sm">
            <IconChartLine size={16} />
          </ThemeIcon>
        </Button>
      </Tooltip>

      <BollingerBandsSettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        bollingerConfig={bollingerConfig}
        showBollingerBands={showBollingerBands}
        updateEnabled={(value) => setShowBollingerBands(value)}
        updatePeriod={updatePeriod}
        updateStdDev={updateStdDev}
        size="sm"
      />
    </>
  );
}
