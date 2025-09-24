import { Switch, NumberInput, Group, Stack } from "@mantine/core";
import { useStochasticQuery } from "@/hooks/indicators/useStochasticQuery";

interface StochasticComponentProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function StochasticComponent({ size = "sm" }: StochasticComponentProps) {
  const {
    showStochastic,
    setShowStochastic,
    stochasticConfig,
    updateKPeriod,
    updateDPeriod,
    updateSmoothing,
  } = useStochasticQuery();

  return (
    <Stack gap="sm">
      <Switch
        label="Show Stochastic Oscillator"
        checked={showStochastic}
        onChange={(event) => setShowStochastic(event.currentTarget.checked)}
        size={size}
        color="red"
      />

      {showStochastic && (
        <Group grow>
          <NumberInput
            label="%K Period"
            value={stochasticConfig.kPeriod}
            onChange={(value) => updateKPeriod(Number(value || 13))}
            min={5}
            max={50}
            step={1}
            size={size}
            placeholder="13"
          />
          <NumberInput
            label="%D Period"
            value={stochasticConfig.dPeriod}
            onChange={(value) => updateDPeriod(Number(value || 3))}
            min={1}
            max={20}
            step={1}
            size={size}
            placeholder="3"
          />
          <NumberInput
            label="Smoothing"
            value={stochasticConfig.smoothing}
            onChange={(value) => updateSmoothing(Number(value || 3))}
            min={1}
            max={10}
            step={1}
            size={size}
            placeholder="3"
          />
        </Group>
      )}
    </Stack>
  );
}
