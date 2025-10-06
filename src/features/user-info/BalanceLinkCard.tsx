"use client";

import { Button, Group, Paper, Text } from "@mantine/core";
import { IconWallet, IconCash } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { IQ_OPTION } from "@/constants/app";

export default function BalanceLinkCard() {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <Paper p="md" withBorder className="bg-white dark:bg-gray-800">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <div>
              <Text size="sm" fw={600} c="var(--mantine-color-gray-9)">
                {t("Balance Management")}
              </Text>
              <Text size="xs" c="var(--mantine-color-gray-6)">
                {t("Manage your account balance")}
              </Text>
            </div>
          </Group>
        </Group>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="filled"
            color="green"
            size="md"
            component="a"
            href={IQ_OPTION.deposit}
            target="_blank"
            rel="noopener noreferrer"
            leftSection={<IconWallet size={16} />}
            fullWidth
          >
            {t("Deposit")}
          </Button>

          <Button
            variant="outline"
            color="blue"
            size="md"
            component="a"
            href={IQ_OPTION.withdraw}
            target="_blank"
            rel="noopener noreferrer"
            leftSection={<IconCash size={16} />}
            fullWidth
          >
            {t("Withdraw")}
          </Button>
        </div>
      </Paper>
    </div>
  );
}
