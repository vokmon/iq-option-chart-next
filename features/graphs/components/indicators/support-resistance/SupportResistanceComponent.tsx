import { Switch, Group, Button } from "@mantine/core";
import { useSupportResistanceTabQuery } from "@/features/graphs/hooks/indicators/support-resistance/useSupportResistanceTabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconSettings } from "@tabler/icons-react";
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
      <Group justify="space-between" align="center" className="min-h-[36px]">
        <Switch
          label={t("Support & Resistance")}
          checked={showSupportResistance}
          onChange={(event) =>
            setShowSupportResistance(event.currentTarget.checked)
          }
          size="sm"
          color="supportResistance.4"
          style={{ flex: 1 }}
        />
        {showSupportResistance && (
          <Button
            variant="subtle"
            size="sm"
            color="supportResistance.4"
            leftSection={<IconSettings size={16} />}
            onClick={() => setOpened(true)}
            style={{ flexShrink: 0 }}
          >
            {t("Settings")}
          </Button>
        )}
      </Group>

      <SupportResistanceSettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        supportResistanceConfig={supportResistanceConfig}
        updateBoxPeriod={updateBoxPeriod}
        size="sm"
      />
    </>
  );
}
