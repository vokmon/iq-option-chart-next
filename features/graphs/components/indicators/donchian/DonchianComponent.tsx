import { Switch, NumberInput, Group, Stack } from "@mantine/core";
import { useDonchianQuery } from "@/hooks/indicators/donchian-channels/useDonchianQuery";
import { useTranslations } from "next-intl";

interface DonchianComponentProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

export function DonchianComponent({ size = "sm" }: DonchianComponentProps) {
  const {
    showDonchian,
    setShowDonchian,
    donchianConfig,
    updateDonchianPeriod,
  } = useDonchianQuery();
  const t = useTranslations();
  return (
    <Stack gap="sm">
      <Switch
        label={t("Show Donchian Channels")}
        checked={showDonchian}
        onChange={(event) => setShowDonchian(event.currentTarget.checked)}
        size={size}
        color="violet"
      />

      {showDonchian && (
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
      )}
    </Stack>
  );
}
