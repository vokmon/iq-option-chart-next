import { Button, Tooltip, ThemeIcon } from "@mantine/core";
import { useDonchianTabQuery } from "@/features/graphs/hooks/indicators/donchian-channels/useDonchianTabQuery";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { IconChartBar } from "@tabler/icons-react";
import { DonchianSettingsModal } from "./DonchianSettingsModal";

export function DonchianComponent() {
  const {
    showDonchian,
    setShowDonchian,
    donchianConfig,
    updateDonchianPeriod,
  } = useDonchianTabQuery();
  const t = useTranslations();
  const [opened, setOpened] = useState(false);

  return (
    <>
      <Tooltip label={t("Donchian Channels Settings")}>
        <Button
          variant="subtle"
          p={2}
          size="xs"
          onClick={() => setOpened(true)}
        >
          <ThemeIcon color={showDonchian ? "donchian.4" : "gray"} size="sm">
            <IconChartBar size={16} />
          </ThemeIcon>
        </Button>
      </Tooltip>

      <DonchianSettingsModal
        opened={opened}
        onClose={() => setOpened(false)}
        donchianConfig={donchianConfig}
        showDonchianChannels={showDonchian}
        updateEnabled={(value) => setShowDonchian(value)}
        updateDonchianPeriod={updateDonchianPeriod}
        size="sm"
      />
    </>
  );
}
