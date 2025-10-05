"use client";

import { useSdk } from "@/hooks/useSdk";
import { Group, Text, Menu, Box, Image } from "@mantine/core";
import LogoutButton from "@/components/buttons/LogoutButton";
import UserMenuButton from "@/components/display/user-info/UserMenuButton";
import UserInfoDisplay from "@/components/display/user-info/UserInfoDisplay";
import LanguageSwitcher from "@/components/display/language/LanguageSwitcher";
import { ThemeSwitcher } from "@/components/display/theme/ThemeSwitcher";
import { useTranslations } from "next-intl";
import TimePanel from "@/components/display/time/TimePanel";
import { APP_METADATA } from "@/constants/app";

export default function AppToolbar() {
  const { sdk } = useSdk();
  const { firstName, lastName, userId } = sdk?.userProfile;
  const t = useTranslations();

  return (
    <Box
      style={{
        background: "var(--gradient-primary)",
        borderBottom: "1px solid var(--glass-border)",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Left side - App title or logo */}
      <Group>
        <div className="w-10 h-10">
          <Image
            src="/icons/icon.svg"
            alt={APP_METADATA.name}
            width={32}
            height={32}
          />
        </div>
        <Text
          size="xl"
          fw={700}
          c="white"
          style={{
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
            letterSpacing: "0.5px",
          }}
        >
          {APP_METADATA.name}
        </Text>
      </Group>

      {/* Right side - User menu */}
      <Group>
        <TimePanel />
        <Menu shadow="md" width={300} position="bottom-end">
          <Menu.Target>
            <UserMenuButton
              firstName={firstName}
              lastName={lastName}
              userId={userId}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{t("Account")}</Menu.Label>

            {/* User Info Display */}
            <Menu.Item className="pointer-events-none">
              <UserInfoDisplay
                firstName={firstName}
                lastName={lastName}
                userId={userId}
              />
            </Menu.Item>

            <Menu.Divider />

            {/* Language Switcher */}
            <Menu.Label>{t("Language")}</Menu.Label>
            <LanguageSwitcher />

            <Menu.Divider />

            {/* Theme Switcher */}
            <Menu.Label>{t("Theme")}</Menu.Label>
            <Box px="md" py="xs">
              <ThemeSwitcher />
            </Box>

            <Menu.Divider />

            <LogoutButton />
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
}
