import { Modal, Stack, Group, NumberInput, Text, Switch } from "@mantine/core";
import { useTranslations } from "next-intl";
import { type RSIConfig } from "@/types/indicators/rsi";

interface RSISettingsModalProps {
  opened: boolean;
  onClose: () => void;
  rsiConfig: RSIConfig;
  showRSI: boolean;
  updateEnabled: (enabled: boolean) => void;
  updatePeriod: (period: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function RSISettingsModal({
  opened,
  onClose,
  rsiConfig,
  showRSI,
  updateEnabled,
  updatePeriod,
  size = "sm",
}: RSISettingsModalProps) {
  const t = useTranslations();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("RSI Settings")}
      size="sm"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {t("Configure RSI parameters")}
        </Text>

        <Switch
          label={t("Enable")}
          checked={showRSI}
          onChange={(event) => updateEnabled(event.currentTarget.checked)}
          size={size}
          color="rsi.4"
        />

        <Group grow>
          <NumberInput
            label={t("RSI Period")}
            value={rsiConfig.period}
            onChange={(value) => updatePeriod(Number(value || 14))}
            min={5}
            max={100}
            step={1}
            size={size}
            placeholder="14"
            disabled={!showRSI}
          />
        </Group>
      </Stack>
    </Modal>
  );
}
