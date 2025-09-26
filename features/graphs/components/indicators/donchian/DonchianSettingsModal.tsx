import { Modal, Stack, Group, NumberInput, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { type DonchianConfig } from "@/utils/indicators/donchian";

interface DonchianSettingsModalProps {
  opened: boolean;
  onClose: () => void;
  donchianConfig: DonchianConfig;
  updateDonchianPeriod: (period: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function DonchianSettingsModal({
  opened,
  onClose,
  donchianConfig,
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
          />
        </Group>
      </Stack>
    </Modal>
  );
}
