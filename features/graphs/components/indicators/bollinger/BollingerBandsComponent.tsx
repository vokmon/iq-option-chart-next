import { Switch, NumberInput, Group, Stack } from "@mantine/core";
import { useBollingerBandsQuery } from "@/hooks/indicators/useBollingerBandsQuery";
import { useTranslations } from "next-intl";

interface BollingerBandsComponentProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function BollingerBandsComponent({
  size = "sm",
}: BollingerBandsComponentProps) {
  const {
    showBollingerBands,
    setShowBollingerBands,
    bollingerConfig,
    updatePeriod,
    updateStdDev,
  } = useBollingerBandsQuery();
  const t = useTranslations();
  return (
    <Stack gap="sm">
      <Switch
        label={t("Show Bollinger Bands")}
        checked={showBollingerBands}
        onChange={(event) => setShowBollingerBands(event.currentTarget.checked)}
        size={size}
      />

      {showBollingerBands && (
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
      )}
    </Stack>
  );
}
