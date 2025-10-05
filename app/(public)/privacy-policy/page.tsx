"use client";

import React from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  ThemeIcon,
  Group,
  Box,
  Card,
  Badge,
} from "@mantine/core";
import {
  IconShield,
  IconEye,
  IconDatabase,
  IconLock,
  IconUser,
  IconSettings,
  IconMail,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMantineTheme } from "@mantine/core";
import { APP_METADATA } from "../../../src/constants/app";
import IqOptionLink from "@/components/display/links/IqOptionLink";

export default function PrivacyPolicyPage() {
  const t = useTranslations();
  const theme = useMantineTheme();

  return (
    <Box
      className="animate-fade-in"
      style={{
        minHeight: "100vh",
        padding: theme.spacing.md,
      }}
    >
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Header Card */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <Stack gap="md" align="center">
              <ThemeIcon size="xl" radius="xl" color="blue" variant="light">
                <IconShield size="2rem" />
              </ThemeIcon>
              <Title order={1} size="2.5rem" fw={700} c="white" ta="center">
                {t("privacy.title")}
              </Title>
              <Text size="xl" c="dimmed" ta="center">
                {t("privacy.lastUpdated")}: {new Date().toLocaleDateString()}
              </Text>
            </Stack>
          </Paper>

          {/* Introduction */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <Stack gap="md">
              <Group>
                <ThemeIcon color="blue" size="lg" radius="xl" variant="light">
                  <IconEye size="1.2rem" />
                </ThemeIcon>
                <Title order={2} size="h3" c="white">
                  {t("privacy.introduction")}
                </Title>
              </Group>
              <Text size="md" c="dimmed">
                {t("privacy.introductionText")} <IqOptionLink path="/profile" />
                .
              </Text>
            </Stack>
          </Paper>

          {/* Information We Collect */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <Stack gap="lg">
              <Group>
                <ThemeIcon color="green" size="lg" radius="xl" variant="light">
                  <IconDatabase size="1.2rem" />
                </ThemeIcon>
                <Title order={2} size="h3" c="white">
                  {t("privacy.informationWeCollect")}
                </Title>
              </Group>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  shadow="xs"
                  padding="md"
                  radius="lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Stack gap="xs">
                    <Text size="md" fw={600} c="white">
                      {t("privacy.personalInformation")}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {t("privacy.personalInformationText")}{" "}
                      <IqOptionLink path="/profile" />.
                    </Text>
                  </Stack>
                </Card>

                <Card
                  shadow="xs"
                  padding="md"
                  radius="lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Stack gap="xs">
                    <Text size="md" fw={600} c="white">
                      {t("privacy.usageData")}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {t("privacy.usageDataText")}
                    </Text>
                  </Stack>
                </Card>

                <Card
                  shadow="xs"
                  padding="md"
                  radius="lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Stack gap="xs">
                    <Text size="md" fw={600} c="white">
                      {t("privacy.tradingData")}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {t("privacy.tradingDataText")}{" "}
                      <IqOptionLink path="/profile" />.
                    </Text>
                  </Stack>
                </Card>

                <Card
                  shadow="xs"
                  padding="md"
                  radius="lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Stack gap="xs">
                    <Text size="md" fw={600} c="white">
                      {t("privacy.deviceInformation")}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {t("privacy.deviceInformationText")}
                    </Text>
                  </Stack>
                </Card>
              </div>
            </Stack>
          </Paper>

          {/* How We Use Information */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <Stack gap="lg">
              <Group>
                <ThemeIcon color="orange" size="lg" radius="xl" variant="light">
                  <IconSettings size="1.2rem" />
                </ThemeIcon>
                <Title order={2} size="h3" c="white">
                  {t("privacy.howWeUseInformation")}
                </Title>
              </Group>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  t("privacy.use1"),
                  t("privacy.use2"),
                  t("privacy.use3"),
                  t("privacy.use4"),
                  t("privacy.use5"),
                  t("privacy.use6"),
                ].map((use, index) => (
                  <Card
                    key={index}
                    shadow="xs"
                    padding="sm"
                    radius="md"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Group gap="sm">
                      <Badge
                        size="sm"
                        color="orange"
                        variant="light"
                        radius="sm"
                      >
                        {index + 1}
                      </Badge>
                      <Text size="sm" c="dimmed">
                        {use}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </div>
            </Stack>
          </Paper>

          {/* Data Protection */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <Stack gap="lg">
              <Group>
                <ThemeIcon color="red" size="lg" radius="xl" variant="light">
                  <IconLock size="1.2rem" />
                </ThemeIcon>
                <Title order={2} size="h3" c="white">
                  {t("privacy.dataProtection")}
                </Title>
              </Group>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card
                  shadow="xs"
                  padding="md"
                  radius="lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Stack gap="xs">
                    <Text size="md" fw={600} c="white">
                      {t("privacy.securityMeasures")}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {t("privacy.securityMeasuresText")}
                    </Text>
                  </Stack>
                </Card>

                <Card
                  shadow="xs"
                  padding="md"
                  radius="lg"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <Stack gap="xs">
                    <Text size="md" fw={600} c="white">
                      {t("privacy.dataRetention")}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {t("privacy.dataRetentionText")}
                    </Text>
                  </Stack>
                </Card>
              </div>
            </Stack>
          </Paper>

          {/* Your Rights */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <Stack gap="lg">
              <Group>
                <ThemeIcon color="blue" size="lg" radius="xl" variant="light">
                  <IconUser size="1.2rem" />
                </ThemeIcon>
                <Title order={2} size="h3" c="white">
                  {t("privacy.yourRights")}
                </Title>
              </Group>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  t("privacy.right1"),
                  t("privacy.right2"),
                  t("privacy.right3"),
                  t("privacy.right4"),
                  t("privacy.right5"),
                  t("privacy.right6"),
                ].map((right, index) => (
                  <Card
                    key={index}
                    shadow="xs"
                    padding="sm"
                    radius="md"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Group gap="sm">
                      <Badge size="sm" color="blue" variant="light" radius="sm">
                        {index + 1}
                      </Badge>
                      <Text size="sm" c="dimmed">
                        {right}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </div>
            </Stack>
          </Paper>

          {/* Contact Information */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <Stack gap="lg">
              <Group>
                <ThemeIcon color="green" size="lg" radius="xl" variant="light">
                  <IconMail size="1.2rem" />
                </ThemeIcon>
                <Title order={2} size="h3" c="white">
                  {t("privacy.contactUs")}
                </Title>
              </Group>
              <Text size="md" c="dimmed">
                {t("privacy.contactText", {
                  supportEmail: APP_METADATA.supportEmail,
                })}
              </Text>
            </Stack>
          </Paper>

          {/* Policy Updates */}
          <Paper
            radius="xl"
            p="lg"
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(59, 130, 246, 0.3)",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)",
            }}
          >
            <Group>
              <ThemeIcon color="blue" size="md" radius="xl" variant="light">
                <IconAlertCircle size="1rem" />
              </ThemeIcon>
              <Text size="md" c="white" fw={500}>
                {t("privacy.policyUpdates")}
              </Text>
            </Group>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
