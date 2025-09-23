import { Switch, NumberInput, Group, Stack } from "@mantine/core";

interface BollingerBandsComponentProps {
  showBollingerBands: boolean;
  onToggleBollingerBands: (show: boolean) => void;
  bollingerConfig: {
    period: number;
    stdDev: number;
  };
  onUpdatePeriod: (period: number) => void;
  onUpdateStdDev: (stdDev: number) => void;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function BollingerBandsComponent({
  showBollingerBands,
  onToggleBollingerBands,
  bollingerConfig,
  onUpdatePeriod,
  onUpdateStdDev,
  size = "sm",
}: BollingerBandsComponentProps) {
  return (
    <Stack gap="sm">
      <Switch
        label="Show Bollinger Bands"
        checked={showBollingerBands}
        onChange={(event) =>
          onToggleBollingerBands(event.currentTarget.checked)
        }
        size={size}
      />

      {showBollingerBands && (
        <Group grow>
          <NumberInput
            label="BB Period"
            value={bollingerConfig.period}
            onChange={(value) => onUpdatePeriod(Number(value || 20))}
            min={5}
            max={100}
            step={1}
            size={size}
            placeholder="14"
          />
          <NumberInput
            label="BB Std Dev"
            value={bollingerConfig.stdDev}
            onChange={(value) => onUpdateStdDev(Number(value || 2))}
            min={1}
            max={5}
            step={0.1}
            decimalScale={1}
            size={size}
            placeholder="2.0"
          />
        </Group>
      )}
    </Stack>
  );
}
