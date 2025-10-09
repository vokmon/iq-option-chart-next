import { Button, Tooltip, ThemeIcon } from "@mantine/core";
import { useSupportResistanceTabQuery } from "@/features/graphs/hooks/indicators/support-resistance/useSupportResistanceTabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconChartDots } from "@tabler/icons-react";
import { SupportResistanceSettingsModal } from "./SupportResistanceSettingsModal";

export function SupportResistanceComponent() {
  const {
    showSupportResistance,
    setShowSupportResistance,
    supportResistanceConfig,
    updateBoxPeriod,
  } = useSupportResistanceTabQuery();
  const t = useTranslations();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Tooltip label={t("Support & Resistance Settings")}>
        <Button
          variant="subtle"
          p={2}
          size="xs"
          onClick={() => setOpened(true)}
        >
          <ThemeIcon color="supportResistance.4" size="sm">
            <IconChartDots size={16} />
          </ThemeIcon>
        </Button>
      </Tooltip>

      <SupportResistanceSettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        supportResistanceConfig={supportResistanceConfig}
        showSupportResistance={showSupportResistance}
        updateEnabled={(value) => setShowSupportResistance(value)}
        updateBoxPeriod={updateBoxPeriod}
        size="sm"
      />
    </>
  );
}
