import { Button, Tooltip, ThemeIcon } from "@mantine/core";
import { useStochasticTabQuery } from "@/features/graphs/hooks/indicators/stochastic/useStochasticTabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconChartArea } from "@tabler/icons-react";
import { StochasticSettingsModal } from "./StochasticSettingsModal";

export function StochasticComponent() {
  const {
    showStochastic,
    setShowStochastic,
    stochasticConfig,
    updateKPeriod,
    updateDPeriod,
    updateSmoothing,
  } = useStochasticTabQuery();
  const t = useTranslations();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Tooltip label={t("Stochastic Oscillator Settings")}>
        <Button
          variant="subtle"
          p={2}
          size="xs"
          onClick={() => setOpened(true)}
        >
          <ThemeIcon color="stochastic.4" size="sm">
            <IconChartArea size={16} />
          </ThemeIcon>
        </Button>
      </Tooltip>

      <StochasticSettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        stochasticConfig={stochasticConfig}
        showStochastic={showStochastic}
        updateEnabled={(value) => setShowStochastic(value)}
        updateKPeriod={updateKPeriod}
        updateDPeriod={updateDPeriod}
        updateSmoothing={updateSmoothing}
        size="sm"
      />
    </>
  );
}
