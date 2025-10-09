import { Modal, Stack, Group, NumberInput, Text, Switch } from "@mantine/core";
import { useTranslations } from "next-intl";
import { type SupportResistanceConfig } from "@/types/indicators/supportResistance";

interface SupportResistanceSettingsModalProps {
  opened: boolean;
  onClose: () => void;
  supportResistanceConfig: SupportResistanceConfig;
  showSupportResistance: boolean;
  updateEnabled: (enabled: boolean) => void;
  updateBoxPeriod: (boxPeriod: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function SupportResistanceSettingsModal({
  opened,
  onClose,
  supportResistanceConfig,
  showSupportResistance,
  updateEnabled,
  updateBoxPeriod,
  size = "sm",
}: SupportResistanceSettingsModalProps) {
  const t = useTranslations();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("Support & Resistance Settings")}
      size="sm"
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {t("Configure Support & Resistance parameters")}
        </Text>

        <Switch
          label={t("Enable")}
          checked={showSupportResistance}
          onChange={(event) => updateEnabled(event.currentTarget.checked)}
          size={size}
          color="supportResistance.4"
        />

        <Group grow>
          <NumberInput
            label={t("Box Period")}
            value={supportResistanceConfig.boxPeriod}
            onChange={(value) => updateBoxPeriod(Number(value || 25))}
            min={5}
            max={100}
            step={1}
            size={size}
            placeholder="25"
            disabled={!showSupportResistance}
          />
        </Group>
      </Stack>
    </Modal>
  );
}
