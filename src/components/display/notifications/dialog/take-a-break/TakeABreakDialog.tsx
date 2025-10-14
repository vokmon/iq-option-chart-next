"use client";

import {
  Modal,
  Stack,
  Text,
  Group,
  ThemeIcon,
  Badge,
  Button,
  Box,
  Divider,
} from "@mantine/core";
import { IconAlertTriangle, IconCoffee } from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { getBalanceTypeColor, getBalanceTypeLabel } from "@/utils/balanceType";
import { BreakWarningEvent } from "@/stores/notifications/breakWarningStore";
import CountdownWithProgressBar from "@/components/display/countdown/CountdownWithProgressBar";

interface TakeABreakDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAcknowledge: () => void;
  activeWarnings: BreakWarningEvent[];
}

export default function TakeABreakDialog({
  isOpen,
  onClose,
  onAcknowledge,
  activeWarnings,
}: TakeABreakDialogProps) {
  const t = useTranslations();

  // Get the first active warning for display
  const activeWarning = activeWarnings.length > 0 ? activeWarnings[0] : null;

  const handleAcknowledge = () => {
    onAcknowledge();
    onClose();
  };

  if (!activeWarning) return null;

  return (
    <Modal
      opened={isOpen}
      onClose={handleAcknowledge}
      centered
      size="lg"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <Stack gap="md">
        {/* Main warning message */}
        <Box className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
          <Group gap="sm" mb="sm" className="nowrap" justify="center">
            <ThemeIcon size="xl" radius="xl" variant="light" color="orange">
              <IconCoffee size={60} />
            </ThemeIcon>
            <Text size="lg" fw={600} c="orange.7" ta="center">
              {t(
                "You've experienced consecutive losses over the past {timeWindow} minutes",
                {
                  timeWindow: activeWarning.timeWindow,
                }
              )}
            </Text>
          </Group>

          <Text size="sm" c="gray.7" mb="md" ta="center">
            {t(
              "This is a good moment to pause, analyze what went wrong, and adjust your approach before continuing"
            )}
          </Text>
        </Box>

        {/* All warnings display */}
        <Stack gap="sm">
          <Text size="sm" fw={600} c="gray.8">
            {activeWarnings.length > 1
              ? t("Here's what happened on your accounts")
              : t("Here's what happened")}
          </Text>

          <Stack gap="md">
            {activeWarnings.map((warning, index) => (
              <Box
                key={warning.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <Group justify="space-between" align="flex-start" mb="sm">
                  <Group gap="sm">
                    <Text size="sm" fw={500} c="gray.7">
                      {t("Account")}{" "}
                      {activeWarnings.length > 1 ? `#${index + 1}` : ""}
                    </Text>
                    <Badge
                      color={getBalanceTypeColor(warning.balance.balanceType)}
                      variant="light"
                      size="sm"
                    >
                      {getBalanceTypeLabel(warning.balance.balanceType)}
                    </Badge>
                  </Group>
                  <ThemeIcon
                    size="sm"
                    radius="xl"
                    variant="light"
                    color="orange"
                  >
                    <IconAlertTriangle size={12} />
                  </ThemeIcon>
                </Group>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                    <Text size="xs" c="dimmed" mb={2}>
                      {t("In the last")}
                    </Text>
                    <Text size="sm" fw={600}>
                      {warning.timeWindow} {t("minutes")}
                    </Text>
                  </div>

                  <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                    <Text size="xs" c="dimmed" mb={2}>
                      {t("You made")}
                    </Text>
                    <Text size="sm" fw={600}>
                      {warning.totalOrders}
                    </Text>
                  </div>

                  <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                    <Text size="xs" c="dimmed" mb={2}>
                      {t("And lost")}
                    </Text>
                    <Text size="sm" fw={600} c="red.5">
                      {warning.lossCount}
                    </Text>
                  </div>

                  <div className="p-3 bg-white dark:bg-gray-900 rounded-lg">
                    <Text size="xs" c="dimmed" mb={2}>
                      {t("Loss rate")}
                    </Text>
                    <Text size="sm" fw={600} c="red.5">
                      {Math.round(
                        (warning.lossCount / warning.totalOrders) * 100
                      )}
                      %
                    </Text>
                  </div>
                </div>
              </Box>
            ))}
          </Stack>
        </Stack>

        {/* Break duration and progress */}

        <>
          <Divider />
          <Stack gap="sm">
            <CountdownWithProgressBar
              title={t("Take your time")}
              subtitle={t(
                "I've turned off auto-trading for you When you're ready to try again, just turn it back on"
              )}
              triggerTime={activeWarning.triggerTime}
              expiresAt={activeWarning.expiresAt}
            />
          </Stack>
        </>

        {/* Action buttons */}
        <Group justify="center" mt="md" gap="sm">
          <Button
            onClick={handleAcknowledge}
            leftSection={<IconCoffee size={16} />}
            size="md"
            radius="xl"
            className="px-6"
            color="orange"
          >
            {t("Got it")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
