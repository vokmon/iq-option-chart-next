"use client";

import {
  Modal,
  Stack,
  Text,
  Group,
  ThemeIcon,
  Badge,
  Button,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { IconShield, IconCheck } from "@tabler/icons-react";
import { formatDateTime } from "@/utils/dateTime";
import { formatAmount } from "@/utils/currency";
import { getBalanceTypeColor, getBalanceTypeLabel } from "@/utils/balanceType";
import {
  BalanceGoalFulfillment,
  GoalFulfillmentType,
} from "@/stores/notifications/goalFulfillmentStore";
interface LossFulfillmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToReports: () => void;
  fulfillments: BalanceGoalFulfillment[];
}

export default function LossFulfillmentDialog({
  isOpen,
  onClose,
  onGoToReports,
  fulfillments,
}: LossFulfillmentDialogProps) {
  const t = useTranslations();

  // Filter only loss fulfillments
  const lossFulfillments = fulfillments.filter(
    (f) => f.type === GoalFulfillmentType.LOSS
  );

  if (lossFulfillments.length === 0) {
    return null;
  }

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={
        <Group gap="sm">
          <ThemeIcon
            size="lg"
            radius="xl"
            variant="light"
            color="red"
            className="animate-pulse"
          >
            <IconShield size={20} />
          </ThemeIcon>
          <Text size="lg" fw={600} c="red.5">
            {t("Loss Limit Reached")}
          </Text>
        </Group>
      }
      centered
      size="md"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <Stack gap="md">
        <Text size="md" fw={500} c="gray.7">
          {t("Daily loss limit reached")}
        </Text>

        <Stack gap="xs">
          {lossFulfillments.map((fulfillment) => (
            <div
              key={fulfillment.id}
              className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700"
            >
              <Group justify="space-between" align="flex-start" mb="sm">
                <Group gap="sm">
                  <Text size="sm" fw={500} c="gray.7">
                    Account
                  </Text>
                  <Badge
                    color={getBalanceTypeColor(fulfillment.balance.balanceType)}
                    variant="light"
                    size="sm"
                  >
                    {getBalanceTypeLabel(fulfillment.balance.balanceType)}
                  </Badge>
                </Group>
                <ThemeIcon size="sm" radius="xl" variant="light" color="red">
                  <IconShield size={12} />
                </ThemeIcon>
              </Group>

              <Stack gap="xs">
                <div>
                  <Text size="sm" fw={600} c="gray.8" mb={2}>
                    {t("Limit")}
                  </Text>
                  <Text size="lg" fw={600} c="red.5">
                    {formatAmount(
                      -fulfillment.targetValue,
                      fulfillment.balance.balanceCurrency
                    )}
                  </Text>
                </div>

                <div>
                  <Text size="sm" fw={600} c="gray.5" mb={2}>
                    {t("Actual")}
                  </Text>
                  <Text size="lg" fw={600} c="red.5">
                    {formatAmount(
                      fulfillment.actualValue,
                      fulfillment.balance.balanceCurrency
                    )}
                  </Text>
                </div>

                <Text size="xs" c="dimmed" mt="xs">
                  {formatDateTime(fulfillment.createdAt)}
                </Text>
              </Stack>
            </div>
          ))}
        </Stack>

        <Group justify="center" mt="md" gap="sm">
          <Button
            variant="outline"
            onClick={onGoToReports}
            size="md"
            radius="xl"
            className="px-6"
          >
            {t("Go to Reports")}
          </Button>
          <Button
            onClick={onClose}
            leftSection={<IconCheck size={16} />}
            size="md"
            radius="xl"
            className="px-6"
          >
            {t("Continue Trading")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
