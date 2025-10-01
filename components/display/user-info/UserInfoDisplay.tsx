"use client";

import { Avatar, Indicator, Text } from "@mantine/core";
import { useTranslations } from "next-intl";

interface UserInfoDisplayProps {
  firstName?: string;
  lastName?: string;
  userId?: number;
}

export default function UserInfoDisplay({
  firstName,
  lastName,
  userId,
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
            style={{ fontSize: "14px" }}
          >
            {getInitials(firstName || "", lastName || "")}
          </Avatar>

          <div>
            <Text size="sm" fw={600} c="var(--mantine-color-gray-9)">
              {fullName}
            </Text>
            <Text size="xs" c="var(--mantine-color-gray-6)">
              ID: {userId}
            </Text>
          </div>
        </Indicator>
      </div>
    </div>
  );
}
