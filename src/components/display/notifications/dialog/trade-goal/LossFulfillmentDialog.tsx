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
          <ThemeIcon size="lg" radius="xl" variant="light" color="orange">
            <IconShield size={20} />
          </ThemeIcon>
          <Text size="lg" fw={700} c="dark.9">
            {t("Loss Limit Reached")}
          </Text>
        </Group>
      }
      centered
      size="lg"
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Stack gap="lg">
        {/* Protection Alert Section */}
        <div className="relative overflow-hidden p-8 bg-white bg-gradient-to-b from-red-50 to-red-100 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/20 to-transparent dark:from-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-100/20 to-transparent dark:from-red-500/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <ThemeIcon
                  size={80}
                  radius="xl"
                  variant="light"
                  color="orange"
                  className="shadow-xl"
                >
                  <IconShield size={48} />
                </ThemeIcon>
              </div>
            </div>

            <Text
              size="xl"
              fw={700}
              className="text-center leading-relaxed mb-2"
              c="dark.9"
            >
              ⚠️ {t("loss limit reached")}
            </Text>

            <Text size="sm" c="dimmed" fw={500} className="text-center">
              Take a break and come back fresh tomorrow
            </Text>
          </div>
        </div>

        {/* Alert Cards */}
        <Stack gap="sm">
          {lossFulfillments.map((fulfillment) => (
            <div
              key={fulfillment.id}
              className="relative p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <Group justify="space-between" align="flex-start" mb="md">
                <Group gap="sm">
                  <Text size="sm" fw={600} c="dimmed">
                    Account
                  </Text>
                  <Badge
                    color={getBalanceTypeColor(fulfillment.balance.balanceType)}
                    variant="light"
                    size="md"
                    className="font-semibold"
                  >
                    {getBalanceTypeLabel(fulfillment.balance.balanceType)}
                  </Badge>
                </Group>
                <ThemeIcon size="md" radius="xl" variant="light" color="orange">
                  <IconShield size={16} />
                </ThemeIcon>
              </Group>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Text size="xs" fw={600} c="dimmed" mb={1}>
                    {t("Limit")} ⚠️
                  </Text>
                  <Text size="lg" fw={700} c="dark.9">
                    {formatAmount(
                      -fulfillment.targetValue,
                      fulfillment.balance.balanceCurrency
                    )}
                  </Text>
                </div>

                <div className="p-3 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                  <Text size="xs" fw={600} c="orange.7" mb={1}>
                    {t("Actual")} 📉
                  </Text>
                  <Text size="lg" fw={800} c="red.7">
                    {formatAmount(
                      -fulfillment.actualValue,
                      fulfillment.balance.balanceCurrency
                    )}
                  </Text>
                </div>
              </div>

              <Text size="xs" c="dimmed" className="italic">
                {formatDateTime(fulfillment.createdAt)}
              </Text>
            </div>
          ))}
        </Stack>

        <Group justify="center" mt="lg" gap="sm">
          <Button
            variant="filled"
            onClick={onGoToReports}
            size="md"
            radius="md"
          >
            {t("Go to Reports")}
          </Button>
          <Button
            variant="light"
            onClick={onClose}
            leftSection={<IconCheck size={16} />}
            size="md"
            radius="md"
          >
            {t("Continue Trading")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
