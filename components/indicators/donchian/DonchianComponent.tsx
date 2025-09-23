import { Switch, NumberInput, Group, Stack } from "@mantine/core";

interface DonchianComponentProps {
  showDonchian: boolean;
  onToggleDonchian: (show: boolean) => void;
  donchianConfig: {
    period: number;
  };
  onUpdatePeriod: (period: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function DonchianComponent({
  showDonchian,
  onToggleDonchian,
  donchianConfig,
  onUpdatePeriod,
  size = "sm",
}: DonchianComponentProps) {
  return (
    <Stack gap="sm">
      <Switch
        label="Show Donchian Channels"
        checked={showDonchian}
        onChange={(event) => onToggleDonchian(event.currentTarget.checked)}
        size={size}
        color="violet"
      />

      {showDonchian && (
        <Group grow>
          <NumberInput
            label="Donchian Period"
            value={donchianConfig.period}
            onChange={(value) => onUpdatePeriod(Number(value || 20))}
            min={5}
            max={100}
            step={1}
            size={size}
            placeholder="20"
          />
        </Group>
      )}
    </Stack>
  );
}
