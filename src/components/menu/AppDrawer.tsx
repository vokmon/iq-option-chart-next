"use client";

import { useState } from "react";
import {
  Drawer,
  Button,
  Group,
  Text,
  Stack,
  Image,
  Box,
  Card,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_METADATA } from "@/constants/app";
import packageJson from "../../../package.json";
import {
  IconMenu2,
  IconHome,
  IconChartBar,
  IconSettings,
  IconUser,
  IconFileText,
  IconShield,
  IconLock,
} from "@tabler/icons-react";

export default function AppDrawer() {
  const [opened, setOpened] = useState(false);
  const t = useTranslations();
  const pathname = usePathname();

  const appLinks = [
    {
      href: "/",
      title: t("Trade Room"),
      icon: IconHome,
    },
    {
      href: "/trade/reports",
      title: t("Trade Reports"),
      icon: IconChartBar,
    },
    {
      href: "/trade/settings",
      title: t("Trade Settings"),
      icon: IconSettings,
    },
    {
      href: "/trade/user-info",
      title: t("User Info"),
      icon: IconUser,
    },
  ];
  const navigationLinks = [
    {
      href: "/term-of-service",
      title: t("terms.title"),
      icon: IconFileText,
    },
    {
      href: "/disclaimer",
      title: t("disclaimer.title"),
      icon: IconShield,
    },
    {
      href: "/privacy-policy",
      title: t("privacy.title"),
      icon: IconLock,
    },
  ];

  return (
    <>
      <Button
        variant="subtle"
        color="white"
        onClick={() => setOpened(true)}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        <IconMenu2 size={20} />
      </Button>

      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("Menu")}
        position="left"
        size="sm"
        styles={{
          header: {
            background: "var(--gradient-primary)",
            color: "white",
          },
          content: {
            background: "var(--mantine-color-body)",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          },
          body: {
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "20px",
          },
        }}
        classNames={{
          content: "bg-slate-900/95 backdrop-blur-md",
          body: "bg-slate-900/95",
        }}
      >
        <div className="flex flex-col gap-4 h-full">
          <div className="flex-1 flex flex-col gap-3">
            {appLinks.map((link, index) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={index}
                  href={link.href}
                  className="block"
                  onClick={() => setOpened(false)}
                >
                  <Card
                    padding="md"
                    radius="lg"
                    withBorder
                    className={`relative backdrop-blur-lg cursor-pointer group ${
                      isActive
                        ? "!bg-gradient-to-r from-blue-600/90 to-blue-500/90 !border-blue-400/60 shadow-lg shadow-blue-500/20 transition-all duration-700 ease-in-out"
                        : "!bg-gradient-to-r from-gray-800/90 to-gray-700/90 !border-gray-600/50 hover:from-gray-700/95 hover:to-gray-600/95 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400/30 hover:scale-[1.02] transition-all duration-300 ease-out"
                    }`}
                    style={{
                      transitionProperty:
                        "background-color, background-image, border-color, color, box-shadow, transform",
                    }}
                  >
                    <div
                      className={`transition-all duration-700 ease-in-out ${
                        isActive
                          ? "border-b-2 border-white pb-1"
                          : "border-b-0 pb-0"
                      }`}
                    >
                      <Group gap="sm" align="center">
                        <link.icon
                          size={20}
                          className={`${
                            isActive
                              ? "text-white transition-all duration-700 ease-in-out"
                              : "text-gray-400 group-hover:text-white transition-all duration-300 ease-out"
                          }`}
                        />
                        <Text
                          size="md"
                          fw={500}
                          className={`${
                            isActive
                              ? "!text-white transition-all duration-700 ease-in-out"
                              : "!text-gray-200 group-hover:text-white transition-all duration-300 ease-out"
                          }`}
                        >
                          {link.title}
                        </Text>
                      </Group>
                    </div>
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-full transition-all duration-700 ease-in-out ${
                        isActive
                          ? "opacity-100 scale-y-100"
                          : "opacity-0 scale-y-0"
                      }`}
                    />
                  </Card>
                </Link>
              );
            })}
          </div>
          {/* Navigation Links */}
          <Stack gap="xs">
            {navigationLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target="_blank"
                className="block"
                onClick={() => setOpened(false)}
              >
                <Card
                  padding="xs"
                  radius="md"
                  withBorder
                  className="!bg-gray-800/80 backdrop-blur-md !border-gray-700 hover:bg-gray-900/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:border-gray-700/30 transition-all duration-200"
                >
                  <Group gap="xs" align="center">
                    <link.icon size={16} className="text-gray-400" />
                    <Text size="sm" c="dimmed" fw={500}>
                      {link.title}
                    </Text>
                  </Group>
                </Card>
              </Link>
            ))}
          </Stack>

          {/* App Info at Bottom */}
          <Box className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-lg shadow-black/10">
            <Group gap="sm">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border border-white/30">
                <Image
                  src="/icons/icon.svg"
                  alt={APP_METADATA.name}
                  width={24}
                  height={24}
                />
              </div>
              <div className="flex flex-col">
                <Text size="sm" fw={600} c="gray" className="drop-shadow-sm">
                  {APP_METADATA.name}
                </Text>
                <Text size="xs" c="dimmed" className="drop-shadow-sm">
                  v {packageJson.version}
                </Text>
              </div>
            </Group>
          </Box>
        </div>
      </Drawer>
    </>
  );
}
