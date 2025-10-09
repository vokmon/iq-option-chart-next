import { Modal, Stack, Group, NumberInput, Text, Switch } from "@mantine/core";
import { useTranslations } from "next-intl";
import { type StochasticConfig } from "@/types/indicators/stochastic";

interface StochasticSettingsModalProps {
  opened: boolean;
  onClose: () => void;
  stochasticConfig: StochasticConfig;
  showStochastic: boolean;
  updateEnabled: (enabled: boolean) => void;
  updateKPeriod: (kPeriod: number) => void;
  updateDPeriod: (dPeriod: number) => void;
  updateSmoothing: (smoothing: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function StochasticSettingsModal({
  opened,
  onClose,
  stochasticConfig,
  showStochastic,
  updateEnabled,
  updateKPeriod,
  updateDPeriod,
  updateSmoothing,
  size = "sm",
}: StochasticSettingsModalProps) {
  const t = useTranslations();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("Stochastic Oscillator Settings")}
      size="sm"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {t("Configure Stochastic Oscillator parameters")}
        </Text>

        <Switch
          label={t("Enable")}
          checked={showStochastic}
          onChange={(event) => updateEnabled(event.currentTarget.checked)}
          size={size}
          color="stochastic.4"
        />

        <Group grow>
          <NumberInput
            label={t("%K Period")}
            value={stochasticConfig.kPeriod}
            onChange={(value) => updateKPeriod(Number(value || 13))}
            min={5}
            max={50}
            step={1}
            size={size}
            placeholder="13"
            disabled={!showStochastic}
          />
          <NumberInput
            label={t("%D Period")}
            value={stochasticConfig.dPeriod}
            onChange={(value) => updateDPeriod(Number(value || 3))}
            min={1}
            max={20}
            step={1}
            size={size}
            placeholder="3"
            disabled={!showStochastic}
          />
        </Group>

        <Group grow>
          <NumberInput
            label={t("Smoothing")}
            value={stochasticConfig.smoothing}
            onChange={(value) => updateSmoothing(Number(value || 3))}
            min={1}
            max={10}
            step={1}
            size={size}
            placeholder="3"
            disabled={!showStochastic}
          />
        </Group>
      </Stack>
    </Modal>
  );
}
