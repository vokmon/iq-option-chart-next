import { Modal, Stack, Group, NumberInput, Text, Switch } from "@mantine/core";
import { useTranslations } from "next-intl";
import { type DonchianConfig } from "@/types/indicators/donchian";

interface DonchianSettingsModalProps {
  opened: boolean;
  onClose: () => void;
  donchianConfig: DonchianConfig;
  showDonchianChannels: boolean;
  updateEnabled: (enabled: boolean) => void;
  updateDonchianPeriod: (period: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function DonchianSettingsModal({
  opened,
  onClose,
  donchianConfig,
  showDonchianChannels,
  updateEnabled,
  updateDonchianPeriod,
  size = "sm",
}: DonchianSettingsModalProps) {
  const t = useTranslations();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("Donchian Channels Settings")}
      size="sm"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {t("Configure Donchian Channels parameters")}
        </Text>

        <Switch
          label={t("Enable")}
          checked={showDonchianChannels}
          onChange={(event) => updateEnabled(event.currentTarget.checked)}
          size={size}
          color="donchian.4"
        />

        <Group grow>
          <NumberInput
            label={t("Donchian Period")}
            value={donchianConfig.period}
            onChange={(value) => updateDonchianPeriod(Number(value || 20))}
            min={5}
            max={100}
            step={1}
            size={size}
            placeholder="20"
            disabled={!showDonchianChannels}
          />
        </Group>
      </Stack>
    </Modal>
  );
}
