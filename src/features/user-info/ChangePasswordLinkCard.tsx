"use client";

import { Button, Group, Paper, Text } from "@mantine/core";
import { IconShield } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { IQ_OPTION } from "@/constants/app";

export default function ChangePasswordLinkCard() {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <Paper p="md" withBorder className="bg-white dark:bg-gray-800">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <div className="flex items-center gap-2">
              <IconShield size={20} color="var(--mantine-color-blue-6)" />
            </div>
            <div>
              <Text size="sm" fw={600} c="var(--mantine-color-gray-9)">
                {t("Security Settings")}
              </Text>
            </div>
          </Group>
          <Button
            variant="light"
            color="blue"
            size="sm"
            component="a"
            href={IQ_OPTION.security}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Change Password")}
          </Button>
        </Group>
      </Paper>
    </div>
  );
}
