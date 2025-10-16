import { Modal, Stack, Group, Text, SegmentedControl } from "@mantine/core";
import { useTranslations } from "next-intl";

interface TimeframeSettingsModalProps {
  opened: boolean;
  onClose: () => void;
  timeframeInMinute: number;
  updateTimeframe: (timeframeInMinute: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const timeframeOptions = [
  { label: "15m", value: "15" },
  { label: "30m", value: "30" },
  { label: "1h", value: "60" },
  { label: "3h", value: "180" },
];

export function TimeframeSettingsModal({
  opened,
  onClose,
  timeframeInMinute,
  updateTimeframe,
  size = "sm",
}: TimeframeSettingsModalProps) {
  const t = useTranslations();

  const handleTimeframeChange = (value: string) => {
    const newTimeframe = parseInt(value, 10);
    updateTimeframe(newTimeframe);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={t("Timeframe")} size="sm">
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          {t("Select chart timeframe")}
        </Text>

        <Group grow>
          <SegmentedControl
            data={timeframeOptions}
            value={timeframeInMinute.toString()}
            onChange={handleTimeframeChange}
            size={size}
            fullWidth
            color="primary"
          />
        </Group>
      </Stack>
    </Modal>
  );
}
