"use client";

import { Avatar, Indicator, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

interface UserInfoDisplayCardProps {
  firstName?: string;
  lastName?: string;
  userId?: number;
}

export default function UserInfoDisplayCard({
  firstName,
  lastName,
  userId,
}: UserInfoDisplayCardProps) {
  const t = useTranslations();

  const getInitials = (first: string, last: string) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
  };

  const fullName =
    `${firstName || ""} ${lastName || ""}`.trim() || `${t("User")} ${userId}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md py-3 px-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <Indicator
          inline
          size={16}
          offset={9}
          position="bottom-end"
          color="green"
          withBorder
          processing
        >
          <Avatar
            size="md"
            radius="xl"
            color="blue"
            style={{ fontSize: "18px" }}
          >
            {getInitials(firstName || "", lastName || "")}
          </Avatar>
        </Indicator>
        <div className="flex-1">
          <Text
            size="md"
            fw={600}
            c="var(--mantine-color-gray-9)"
            className="mb-1"
          >
            {fullName}
          </Text>
          <Text size="sm" c="var(--mantine-color-gray-6)">
            {t("User ID")}: {userId}
          </Text>
        </div>
      </div>
    </div>
  );
}
