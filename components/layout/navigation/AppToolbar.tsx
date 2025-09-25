"use client";

import { useSdk } from "@/hooks/useSdk";
import { Group, Text, Menu, Box } from "@mantine/core";
import LogoutButton from "@/components/buttons/LogoutButton";
import UserMenuButton from "@/components/display/user-info/UserMenuButton";
import UserInfoDisplay from "@/components/display/user-info/UserInfoDisplay";

export default function AppToolbar() {
  const { sdk } = useSdk();
  const { firstName, lastName, userId } = sdk?.userProfile;

  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Left side - App title or logo */}
      <Group>
        <Text
          size="xl"
          fw={700}
          c="white"
          style={{
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            letterSpacing: "0.5px",
          }}
        >
          IQ Option Charts
        </Text>
      </Group>

      {/* Right side - User menu */}
      <Group>
        <Menu shadow="md" width={200} position="bottom-end">
          <Menu.Target>
            <UserMenuButton
              firstName={firstName}
              lastName={lastName}
              userId={userId}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Account</Menu.Label>

            {/* User Info Display */}
            <Menu.Item disabled>
              <UserInfoDisplay
                firstName={firstName}
                lastName={lastName}
                userId={userId}
              />
            </Menu.Item>

            <Menu.Divider />

            <LogoutButton />
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
}
