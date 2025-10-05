"use client";

import { useState } from "react";
import {
  Drawer,
  Button,
  Group,
  Text,
  Stack,
  Divider,
  Image,
  Box,
  Anchor,
  Card,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { APP_METADATA } from "@/constants/app";
import { IconMenu2 } from "@tabler/icons-react";

export default function AppDrawer() {
  const [opened, setOpened] = useState(false);
  const t = useTranslations();

  const navigationLinks = [
    {
      href: "/term-of-service",
      title: t("terms.title"),
    },
    {
      href: "/disclaimer",
      title: t("disclaimer.title"),
    },
    {
      href: "/privacy-policy",
      title: t("privacy.title"),
    },
  ];

  return (
    <>
      <Button
        variant="subtle"
        color="white"
        leftSection={<IconMenu2 size={20} />}
        onClick={() => setOpened(true)}
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {t("Menu")}
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
          <div className="flex-1">123</div>
          {/* Navigation Links */}
          <Stack gap="xs">
            {navigationLinks.map((link, index) => (
              <Card
                key={index}
                component="a"
                href={link.href}
                padding="xs"
                radius="md"
                withBorder
                className="!bg-gray-800/80 backdrop-blur-md !border-gray-700 hover:bg-gray-900/90 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20 hover:border-gray-700/30 transition-all duration-200"
              >
                <Text size="sm" c="dimmed" fw={500}>
                  {link.title}
                </Text>
              </Card>
            ))}
          </Stack>

          <Divider />

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
              <Text size="sm" fw={600} c="gray" className="drop-shadow-sm">
                {APP_METADATA.name}
              </Text>
            </Group>
          </Box>
        </div>
      </Drawer>
    </>
  );
}
