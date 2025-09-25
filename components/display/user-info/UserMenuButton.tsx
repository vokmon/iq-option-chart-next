"use client";

import { Button, Avatar, Text } from "@mantine/core";
import { forwardRef } from "react";

interface UserMenuButtonProps {
  firstName?: string;
  lastName?: string;
  userId?: number;
}

const UserMenuButton = forwardRef<HTMLButtonElement, UserMenuButtonProps>(
  ({ firstName, lastName, userId, ...props }, ref) => {
    const getInitials = (first: string, last: string) => {
      return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
    };

    const fullName =
      `${firstName || ""} ${lastName || ""}`.trim() || `User ${userId}`;

    return (
      <Button
        ref={ref}
        variant="subtle"
        rightSection={
          <Text
            c="white"
            fw={600}
            style={{ textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)" }}
          >
            ▼
          </Text>
        }
        leftSection={
          <Avatar
            size="sm"
            radius="xl"
            color="white"
            style={{
              fontSize: "12px",
              background: "rgba(255, 255, 255, 0.25)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              fontWeight: "600",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
            }}
          >
            {getInitials(firstName || "", lastName || "")}
          </Avatar>
        }
        style={{
          height: "44px",
          padding: "0 16px",
          borderRadius: "22px",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          transition: "all 0.2s ease",
        }}
        {...props}
      >
        <Text
          size="sm"
          fw={600}
          c="white"
          truncate
          style={{
            maxWidth: "120px",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          {fullName}
        </Text>
      </Button>
    );
  }
);

UserMenuButton.displayName = "UserMenuButton";

export default UserMenuButton;
