import { Switch, Group, Button } from "@mantine/core";
import { useStochasticQuery } from "@/features/graphs/hooks/indicators/stochastic/useStochasticQuery";
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
  } = useStochasticQuery();
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
          color="red"
          style={{ flex: 1 }}
        />
        {showStochastic && (
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconSettings size={16} />}
            onClick={() => setOpened(true)}
            color="red"
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
