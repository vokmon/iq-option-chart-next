"use client";

import { Avatar, Text } from "@mantine/core";

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
  const getInitials = (first: string, last: string) => {
    return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
  };

  const fullName =
    `${firstName || ""} ${lastName || ""}`.trim() || `User ${userId}`;

  return (
    <div style={{ padding: "8px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Avatar size="md" radius="xl" color="blue" style={{ fontSize: "14px" }}>
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
      </div>
    </div>
  );
}
