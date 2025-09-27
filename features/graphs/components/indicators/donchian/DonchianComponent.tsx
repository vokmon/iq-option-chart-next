import { Switch, Group, Button } from "@mantine/core";
import { useDonchianTabQuery } from "@/features/graphs/hooks/indicators/donchian-channels/useDonchianTabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconSettings } from "@tabler/icons-react";
import { DonchianSettingsModal } from "./DonchianSettingsModal";

interface DonchianComponentProps {
  tabId: string | null;
}

export function DonchianComponent({ tabId }: DonchianComponentProps) {
  const {
    showDonchian,
    setShowDonchian,
    donchianConfig,
    updateDonchianPeriod,
  } = useDonchianTabQuery(tabId);
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
