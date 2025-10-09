"use client";

import { Button, Avatar, Text, Indicator } from "@mantine/core";
import { forwardRef } from "react";
import { User } from "@/types/user";

interface UserMenuButtonProps {
  user?: User;
  firstName?: string;
  lastName?: string;
}

const UserMenuButton = forwardRef<HTMLButtonElement, UserMenuButtonProps>(
  ({ firstName, lastName, user, ...props }, ref) => {
    const getInitials = (first: string, last: string) => {
      return `${first?.charAt(0) || ""}${last?.charAt(0) || ""}`.toUpperCase();
    };

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
          <Indicator
            inline
            size={10}
            offset={5}
            position="bottom-end"
            color="green"
            processing
            withBorder
          >
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
          </Indicator>
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
            maxWidth: "200px",
            textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          {user?.email}
        </Text>
      </Button>
    );
  }
);

UserMenuButton.displayName = "UserMenuButton";

export default UserMenuButton;
