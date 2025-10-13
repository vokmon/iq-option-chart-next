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
import { IconCheck, IconCash, IconTrophy } from "@tabler/icons-react";
import { formatDateTime } from "@/utils/dateTime";
import { formatAmount } from "@/utils/currency";
import { getBalanceTypeColor, getBalanceTypeLabel } from "@/utils/balanceType";
import {
  BalanceGoalFulfillment,
  GoalFulfillmentType,
} from "@/stores/notifications/goalFulfillmentStore";
import { IQ_OPTION } from "@/constants/app";
interface ProfitFulfillmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToReports: () => void;
  fulfillments: BalanceGoalFulfillment[];
}

export default function ProfitFulfillmentDialog({
  isOpen,
  onClose,
  onGoToReports,
  fulfillments,
}: ProfitFulfillmentDialogProps) {
  const t = useTranslations();

  // Filter only profit fulfillments
  const profitFulfillments = fulfillments.filter(
    (f) => f.type === GoalFulfillmentType.PROFIT
  );

  if (profitFulfillments.length === 0) {
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
            variant="gradient"
            gradient={{ from: "yellow.5", to: "orange.5", deg: 135 }}
          >
            <IconTrophy size={20} />
          </ThemeIcon>
          <Text size="lg" fw={700} c="dark.9">
            {t("Profit Target Reached")}
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
        {/* Celebratory Hero Section */}
        <div className="relative overflow-hidden p-8 bg-white bg-gradient-to-b from-green-50 to-green-100 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/20 to-transparent dark:from-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-100/20 to-transparent dark:from-yellow-500/10 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <ThemeIcon
                  size={80}
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: "yellow.5", to: "orange.5", deg: 135 }}
                  className="shadow-xl"
                >
                  <IconTrophy size={48} />
                </ThemeIcon>
              </div>
            </div>

            <Text
              size="xl"
              fw={700}
              className="text-center leading-relaxed mb-2"
              c="dark.9"
            >
              🎉 {t("goal fulfillment reached")}
            </Text>

            <Text size="sm" c="dimmed" fw={500} className="text-center">
              {t("Time to celebrate and secure your profits!")}
            </Text>
          </div>
        </div>

        {/* Achievement Cards */}
        <Stack gap="sm">
          {profitFulfillments.map((fulfillment) => (
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
                <ThemeIcon size="md" radius="xl" variant="light" color="green">
                  <IconCheck size={16} />
                </ThemeIcon>
              </Group>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-3 bg-white dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <Text size="xs" fw={600} c="dimmed" mb={1}>
                    {t("Target")} 🎯
                  </Text>
                  <Text size="lg" fw={700} c="dark.9">
                    {formatAmount(fulfillment.targetValue, "USD")}
                  </Text>
                </div>

                <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <Text size="xs" fw={600} c="green.7" mb={1}>
                    {t("Actual")} ✨
                  </Text>
                  <Text size="lg" fw={800} c="green.7">
                    {formatAmount(fulfillment.actualValue, "USD")}
                  </Text>
                </div>
              </div>

              <Text size="xs" c="dimmed" className="italic">
                {formatDateTime(fulfillment.createdAt)}
              </Text>
            </div>
          ))}
        </Stack>

        {/* Call to Action Buttons */}
        <Stack gap="sm" mt="lg">
          <Button
            component="a"
            href={IQ_OPTION.withdraw}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            radius="md"
            color="green"
            leftSection={<IconCash size={20} />}
            className="shadow-md hover:shadow-lg transition-all"
            fullWidth
          >
            {t("Withdraw")} - {t("Secure Your Profits Now")}
          </Button>

          <Group justify="center" gap="sm" mt="xs">
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
      </Stack>
    </Modal>
  );
}
