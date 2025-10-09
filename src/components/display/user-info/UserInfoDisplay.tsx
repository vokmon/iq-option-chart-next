"use client";

import { Avatar, Indicator, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import { User } from "@/types/user";

interface UserInfoDisplayProps {
  firstName?: string;
  lastName?: string;
  userId?: number;
  user?: User;
}

export default function UserInfoDisplay({
  firstName,
  lastName,
  userId,
  user,
}: UserInfoDisplayProps) {
  const t = useTranslations();

  const getInitials = (first: string, last: string) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
  };

  const fullName =
    `${firstName || ""} ${lastName || ""}`.trim() || `${t("User")} ${userId}`;

  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="flex flex-row justify-start items-center gap-2">
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
              size="lg"
              radius="xl"
              color="blue"
              style={{ fontSize: "14px" }}
            >
              {getInitials(firstName || "", lastName || "")}
            </Avatar>
          </Indicator>
          <div className="flex flex-col gap-1">
            <Text size="sm" fw={600} c="var(--mantine-color-gray-9)">
              {fullName}
            </Text>
            <Text size="xs" c="var(--mantine-color-gray-6)">
              {t("Email")}: {user?.email}
            </Text>
            <Text size="xs" c="var(--mantine-color-gray-6)">
              {t("ID")}: {user?.iqOptionId}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
}
