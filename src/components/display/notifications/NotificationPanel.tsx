"use client";

import React from "react";
import {
  Button,
  Menu,
  Text,
  Group,
  ThemeIcon,
  Stack,
  Box,
  Indicator,
} from "@mantine/core";
import { IconBell } from "@tabler/icons-react";
import { useTodayGoalNotifications } from "./hooks/useTodayGoalNotifications";
import { useTranslations } from "next-intl";
import { useTakeABreakNotification } from "./hooks/useTakeABreakNotification";
import GoalFultillmentNotificationList from "./notification-elements/goal-fulfillment/GoalFultillmentNotificationList";
import TakeABreakNotificationList from "./notification-elements/take-a-break/TakeABreakNotificationList";

export default function NotificationPanel() {
  const t = useTranslations();

  const { todayNotifications, hasNotifications: hasGoalNotificationsToday } =
    useTodayGoalNotifications();

  const { activeWarnings, hasActiveWarnings: hasTakeABreakNotifications } =
    useTakeABreakNotification();

  const hasNotifications =
    hasGoalNotificationsToday || hasTakeABreakNotifications;

  return (
    <Menu shadow="md" width={350} position="bottom-end">
      <Menu.Target>
        <Indicator
          inline
          size={15}
          offset={8}
          position="top-end"
          color="orange"
          withBorder
          processing
          disabled={!hasNotifications}
        >
          <Button
            variant="subtle"
            style={{
              height: "44px",
              padding: "0 16px",
              borderRadius: "22px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(10px)",
              transition: "all 0.2s ease",
              position: "relative",
            }}
          >
            <Group gap="xs" align="center">
              <ThemeIcon
                size="sm"
                radius="sm"
                variant="light"
                color="white"
                style={{
                  background: "rgba(255, 255, 255, 0.25)",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                }}
              >
                <IconBell size={16} />
              </ThemeIcon>
            </Group>
          </Button>
        </Indicator>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Group justify="space-between" align="center">
            <Text size="sm" fw={600}>
              {t("Notifications")}
            </Text>
          </Group>
        </Menu.Label>

        {!hasNotifications ? (
          <Box px="md" py="lg" style={{ textAlign: "center" }}>
            <ThemeIcon
              size="xl"
              radius="xl"
              variant="light"
              color="gray"
              style={{ margin: "0 auto 12px" }}
            >
              <IconBell size={24} />
            </ThemeIcon>
            <Text size="sm" c="dimmed">
              {t("No new notifications")}
            </Text>
          </Box>
        ) : (
          <Stack gap="xs" p="xs">
            <TakeABreakNotificationList warnings={activeWarnings} />
            <GoalFultillmentNotificationList
              notifications={todayNotifications}
            />
          </Stack>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
