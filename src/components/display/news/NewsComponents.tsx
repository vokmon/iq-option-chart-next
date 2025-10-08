"use client";

import React from "react";
import {
  Button,
  Menu,
  Text,
  Group,
  ThemeIcon,
  Stack,
  Box,
  Divider,
} from "@mantine/core";
import {
  IconNews,
  IconExternalLink,
  IconCalendar,
  IconWorld,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

interface NewsWebsite {
  name: string;
  url: string;
  description: string;
  icon: React.ReactNode;
}

const getCurrencyImpactWebsites = (
  t: (key: string) => string
): NewsWebsite[] => [
  {
    name: t("Forex Factory Calendar"),
    url: "https://www.forexfactory.com/calendar?day=today",
    description: t("Today's economic calendar"),
    icon: <IconCalendar size={16} />,
  },
  {
    name: t("Investing_com Economic Calendar"),
    url: "https://www.investing.com/economic-calendar/",
    description: t("Economic events calendar"),
    icon: <IconCalendar size={16} />,
  },
];

const getGeneralNewsWebsites = (t: (key: string) => string): NewsWebsite[] => [
  {
    name: t("Forex Factory"),
    url: "https://www.forexfactory.com/",
    description: t("Forex news and analysis"),
    icon: <IconWorld size={16} />,
  },
  {
    name: t("Investing_com"),
    url: "https://www.investing.com/",
    description: t("Financial news and market data"),
    icon: <IconWorld size={16} />,
  },
  {
    name: t("Trading Economics"),
    url: "https://tradingeconomics.com/",
    description: t("Economic indicators and news"),
    icon: <IconWorld size={16} />,
  },
];

export default function NewsComponents() {
  const t = useTranslations();

  const handleWebsiteClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const currencyImpactWebsites = getCurrencyImpactWebsites(t);
  const generalNewsWebsites = getGeneralNewsWebsites(t);

  return (
    <Menu shadow="md" width={400} position="bottom-end">
      <Menu.Target>
        <Button
          variant="subtle"
          style={{
            height: "44px",
            padding: "0 16px",
            borderRadius: "22px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            transition: "all 0.2s ease",
            position: "relative",
          }}
        >
          <Group gap="xs" align="center">
            <ThemeIcon
              size="sm"
              radius="sm"
              variant="light"
              color="white"
              style={{
                background: "rgba(255, 255, 255, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
              }}
            >
              <IconNews size={16} />
            </ThemeIcon>
            <Text size="sm" c="white" fw={500}>
              {t("News")}
            </Text>
          </Group>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Group justify="space-between" align="center">
            <Text size="sm" fw={600}>
              {t("News & Analysis")}
            </Text>
          </Group>
        </Menu.Label>

        <Stack gap="xs" p="xs">
          {/* Currency Impact Section */}
          <Box>
            <Text size="xs" fw={600} c="dimmed" mb="xs" px="xs">
              {t("Currency Impact")}
            </Text>
            {currencyImpactWebsites.map((website, index) => (
              <Menu.Item
                key={index}
                onClick={() => handleWebsiteClick(website.url)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Group justify="space-between" align="center">
                  <Group gap="sm" align="center">
                    <ThemeIcon
                      size="sm"
                      radius="sm"
                      variant="light"
                      color="blue"
                    >
                      {website.icon}
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" fw={500}>
                        {website.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {website.description}
                      </Text>
                    </Box>
                  </Group>
                  <IconExternalLink
                    size={14}
                    color="var(--mantine-color-dimmed)"
                  />
                </Group>
              </Menu.Item>
            ))}
          </Box>

          <Divider />

          {/* General News Section */}
          <Box>
            <Text size="xs" fw={600} c="dimmed" mb="xs" px="xs">
              {t("General News")}
            </Text>
            {generalNewsWebsites.map((website, index) => (
              <Menu.Item
                key={index}
                onClick={() => handleWebsiteClick(website.url)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Group justify="space-between" align="center">
                  <Group gap="sm" align="center">
                    <ThemeIcon
                      size="sm"
                      radius="sm"
                      variant="light"
                      color="green"
                    >
                      {website.icon}
                    </ThemeIcon>
                    <Box>
                      <Text size="sm" fw={500}>
                        {website.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {website.description}
                      </Text>
                    </Box>
                  </Group>
                  <IconExternalLink
                    size={14}
                    color="var(--mantine-color-dimmed)"
                  />
                </Group>
              </Menu.Item>
            ))}
          </Box>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
