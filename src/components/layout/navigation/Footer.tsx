"use client";

import React from "react";
import {
  Container,
  Group,
  Text,
  Anchor,
  Stack,
  Box,
  Image,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { APP_METADATA } from "@/constants/app";
import LanguageSwitcher from "@/components/display/language/LanguageSwitcher";

export default function Footer() {
  const t = useTranslations();

  return (
    <Box
      className="bg-gradient-to-br from-dark-800 via-dark-700 to-dark-900"
      style={{
        borderTop: "1px solid var(--glass-border)",
        boxShadow: "var(--glass-shadow)",
      }}
    >
      <Container size="lg" py="xl">
        <Stack gap="lg">
          {/* Main Footer Content */}
          <Group justify="space-between" align="flex-start" wrap="wrap">
            {/* App Info */}
            <Stack gap="sm" style={{ flex: 1, minWidth: "250px" }}>
              <Group gap="sm" align="center">
                <div className="w-10 h-10">
                  <Image
                    src="/icons/icon.svg"
                    alt={APP_METADATA.name}
                    width={32}
                    height={32}
                    style={{ flexShrink: 0 }}
                  />
                </div>
                <Text size="lg" fw={600} c="white">
                  {APP_METADATA.name}
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {APP_METADATA.description}
              </Text>
            </Stack>

            {/* Legal Links */}
            <Stack gap="sm" align="flex-end" style={{ minWidth: "150px" }}>
              <Stack gap="xs" align="flex-end">
                <Anchor
                  component={Link}
                  href="/term-of-service"
                  size="sm"
                  c="dimmed"
                  style={{ textDecoration: "none" }}
                >
                  {t("terms.title")}
                </Anchor>
                <Anchor
                  component={Link}
                  href="/disclaimer"
                  size="sm"
                  c="dimmed"
                  style={{ textDecoration: "none" }}
                >
                  {t("disclaimer.title")}
                </Anchor>
                <Anchor
                  component={Link}
                  href="/privacy-policy"
                  size="sm"
                  c="dimmed"
                  style={{ textDecoration: "none" }}
                >
                  {t("privacy.title")}
                </Anchor>
              </Stack>
            </Stack>
          </Group>

          {/* Bottom Bar */}
          <Box
            style={{
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "1rem",
            }}
          >
            <Group justify="space-between" align="center" wrap="wrap">
              <Text size="xs" c="dimmed">
                © {new Date().getFullYear()} {t("Trading Charts")}.{" "}
                {t("All rights reserved")}.
              </Text>
              <Group gap="md">
                <LanguageSwitcher />
              </Group>
            </Group>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
