import { Switch, Group, Button } from "@mantine/core";
import { useDonchianQuery } from "@/features/graphs/hooks/indicators/donchian-channels/useDonchianQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconSettings } from "@tabler/icons-react";
import { DonchianSettingsModal } from "./DonchianSettingsModal";

export function DonchianComponent() {
  const {
    showDonchian,
    setShowDonchian,
    donchianConfig,
    updateDonchianPeriod,
  } = useDonchianQuery();
  const t = useTranslations();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Group justify="space-between" align="center">
        <Switch
          label={t("Donchian Channels")}
          checked={showDonchian}
          onChange={(event) => setShowDonchian(event.currentTarget.checked)}
          size="sm"
          color="donchian.4"
          style={{ flex: 1 }}
        />
        {showDonchian && (
          <Button
            variant="subtle"
            size="sm"
            leftSection={<IconSettings size={16} />}
            onClick={() => setOpened(true)}
            color="donchian.4"
            style={{ flexShrink: 0 }}
          >
            {t("Settings")}
          </Button>
        )}
      </Group>

      <DonchianSettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        donchianConfig={donchianConfig}
        updateDonchianPeriod={updateDonchianPeriod}
        size="sm"
      />
    </>
  );
}
