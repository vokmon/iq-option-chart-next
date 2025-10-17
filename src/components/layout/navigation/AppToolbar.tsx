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
import AppDrawer from "@/components/menu/AppDrawer";
import Link from "next/link";
import NotificationPanel from "@/components/display/notifications/NotificationPanel";
import NewsComponents from "@/components/display/news/NewsComponents";
import { useUserStore } from "@/stores/userStore";
import SubscriptExpire from "@/components/display/user-info/SubscriptExpire";

export default function AppToolbar() {
  const { sdk } = useSdk();
  const { firstName, lastName, userId } = sdk?.userProfile;
  const { user } = useUserStore();
  const t = useTranslations();

  return (
    <Box
      style={{
        background: "var(--gradient-primary)",
        borderBottom: "1px solid var(--glass-border)",
        padding: "0 24px",
        height: "64px",
        minHeight: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Left side - App title or logo */}
      <Group>
        <AppDrawer />
        <div className="w-20 h-[auto] hidden sm:block">
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
          className="hidden sm:block"
        >
          {APP_METADATA.name}
        </Text>
      </Group>

      {/* Right side - User menu */}
      <Group>
        <NewsComponents />
        <NotificationPanel />
        <div className="hidden lg:block">
          <TimePanel />
        </div>
        <Menu shadow="md" width={300} position="bottom-end">
          <Menu.Target>
            <UserMenuButton
              user={user}
              firstName={firstName}
              lastName={lastName}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>{t("Account")}</Menu.Label>

            {/* User Info Display */}
            <Menu.Item>
              <Link href="/trade/user-info">
                <UserInfoDisplay
                  firstName={firstName}
                  lastName={lastName}
                  userId={userId}
                  user={user}
                />
              </Link>
            </Menu.Item>

            <Menu.Divider />

            <Menu.Item>
              <SubscriptExpire user={user} />
            </Menu.Item>

            <Menu.Divider />

            {/* Language Switcher */}
            <Menu.Label>{t("Language")}</Menu.Label>
            <LanguageSwitcher />

            <Menu.Divider />

            {/* Theme Switcher */}
            {/* <Menu.Label>{t("Theme")}</Menu.Label>
            <Box px="md" py="xs">
              <ThemeSwitcher />
            </Box> */}

            <Menu.Divider />

            <LogoutButton />
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Box>
  );
}
