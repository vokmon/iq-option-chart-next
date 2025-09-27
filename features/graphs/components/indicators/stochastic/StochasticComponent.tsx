import { Switch, Group, Button } from "@mantine/core";
import { useStochasticTabQuery } from "@/features/graphs/hooks/indicators/stochastic/useStochasticTabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconSettings } from "@tabler/icons-react";
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
      <Group justify="space-between" align="center">
        <Switch
          label={t("Stochastic Oscillator")}
          checked={showStochastic}
          onChange={(event) => setShowStochastic(event.currentTarget.checked)}
          size="sm"
          color="stochastic.4"
          style={{ flex: 1 }}
        />
        {showStochastic && (
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconSettings size={16} />}
            onClick={() => setOpened(true)}
            color="stochastic.4"
            style={{ flexShrink: 0 }}
          >
            {t("Settings")}
          </Button>
        )}
      </Group>

      <StochasticSettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        stochasticConfig={stochasticConfig}
        updateKPeriod={updateKPeriod}
        updateDPeriod={updateDPeriod}
        updateSmoothing={updateSmoothing}
        size="sm"
      />
    </>
  );
}
