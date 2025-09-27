import { Modal, Stack, Group, NumberInput, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { type BollingerBandsConfig } from "@/types/indicators/bollingerBands";

interface BollingerBandsSettingsModalProps {
  opened: boolean;
  onClose: () => void;
  bollingerConfig: BollingerBandsConfig;
  updatePeriod: (period: number) => void;
  updateStdDev: (stdDev: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function BollingerBandsSettingsModal({
  opened,
  onClose,
  bollingerConfig,
  updatePeriod,
  updateStdDev,
  size = "sm",
}: BollingerBandsSettingsModalProps) {
  const t = useTranslations();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("Bollinger Bands Settings")}
      size="sm"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {t("Configure Bollinger Bands parameters")}
        </Text>

        <Group grow>
          <NumberInput
            label={t("BB Period")}
            value={bollingerConfig.period}
            onChange={(value) => updatePeriod(Number(value || 20))}
            min={5}
            max={100}
            step={1}
            size={size}
            placeholder="14"
          />
          <NumberInput
            label={t("BB Std Dev")}
            value={bollingerConfig.stdDev}
            onChange={(value) => updateStdDev(Number(value || 2))}
            min={1}
            max={5}
            step={0.1}
            decimalScale={1}
            size={size}
            placeholder="2.0"
          />
        </Group>
      </Stack>
    </Modal>
  );
}
