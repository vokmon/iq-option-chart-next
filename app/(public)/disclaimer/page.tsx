"use client";

import React from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Stack,
  ThemeIcon,
  Alert,
  Group,
  Box,
  Card,
  Badge,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconInfoCircle,
  IconShield,
  IconExclamationMark,
  IconGavel,
  IconUserCheck,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMantineTheme } from "@mantine/core";

export default function DisclaimerPage() {
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
              <ThemeIcon size="xl" radius="xl" color="red" variant="light">
                <IconGavel size="2rem" />
              </ThemeIcon>
              <Title order={1} size="2.5rem" fw={700} c="white" ta="center">
                {t("disclaimer.title")}
              </Title>
              <Text size="xl" c="dimmed" ta="center">
                {t("disclaimer.lastUpdated")}: {new Date().toLocaleDateString()}
              </Text>
            </Stack>
          </Paper>

          {/* Critical Warning Card */}
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
            <Alert
              icon={<IconAlertTriangle size="1.5rem" />}
              title={t("disclaimer.highRiskWarningTitle")}
              color="red"
              variant="light"
              radius="lg"
              style={{
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <Text size="md" fw={500} c="red">
                {t("disclaimer.highRiskWarning")}
              </Text>
            </Alert>
          </Paper>

          {/* Main Disclaimers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <ThemeIcon color="red" size="lg" radius="xl" variant="light">
                    <IconExclamationMark size="1.2rem" />
                  </ThemeIcon>
                  <Title order={3} size="h4" c="white">
                    {t("disclaimer.noGuaranteeTitle")}
                  </Title>
                </Group>
                <Text size="md" c="dimmed">
                  {t("disclaimer.noGuaranteeText")}
                </Text>
              </Stack>
            </Paper>

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
                  <ThemeIcon
                    color="orange"
                    size="lg"
                    radius="xl"
                    variant="light"
                  >
                    <IconAlertTriangle size="1.2rem" />
                  </ThemeIcon>
                  <Title order={3} size="h4" c="white">
                    {t("disclaimer.riskOfLossTitle")}
                  </Title>
                </Group>
                <Text size="md" c="dimmed">
                  {t("disclaimer.riskOfLossText")}
                </Text>
              </Stack>
            </Paper>

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
                    <IconInfoCircle size="1.2rem" />
                  </ThemeIcon>
                  <Title order={3} size="h4" c="white">
                    {t("disclaimer.informationOnlyTitle")}
                  </Title>
                </Group>
                <Text size="md" c="dimmed">
                  {t("disclaimer.informationOnlyText")}
                </Text>
              </Stack>
            </Paper>

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
                  <ThemeIcon
                    color="green"
                    size="lg"
                    radius="xl"
                    variant="light"
                  >
                    <IconShield size="1.2rem" />
                  </ThemeIcon>
                  <Title order={3} size="h4" c="white">
                    {t("disclaimer.investResponsiblyTitle")}
                  </Title>
                </Group>
                <Text size="md" c="dimmed">
                  {t("disclaimer.investResponsiblyText")}
                </Text>
              </Stack>
            </Paper>
          </div>

          {/* Additional Legal Disclaimers */}
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
              <Title order={2} size="h3" c="white" ta="center">
                {t("disclaimer.additionalLegalDisclaimers")}
              </Title>

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
                      {t("disclaimer.educationalPurposeTitle")}
                    </Text>
                    <Text size="md" c="dimmed">
                      {t("disclaimer.educationalPurposeText")}
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
                      {t("disclaimer.noFinancialAdviceTitle")}
                    </Text>
                    <Text size="md" c="dimmed">
                      {t("disclaimer.noFinancialAdviceText")}
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
                      {t("disclaimer.marketRisksTitle")}
                    </Text>
                    <Text size="md" c="dimmed">
                      {t("disclaimer.marketRisksText")}
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
                      {t("disclaimer.technicalLimitationsTitle")}
                    </Text>
                    <Text size="md" c="dimmed">
                      {t("disclaimer.technicalLimitationsText")}
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
                      {t("disclaimer.regulatoryComplianceTitle")}
                    </Text>
                    <Text size="md" c="dimmed">
                      {t("disclaimer.regulatoryComplianceText")}
                    </Text>
                  </Stack>
                </Card>
              </div>
            </Stack>
          </Paper>

          {/* User Responsibilities */}
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
                  <IconUserCheck size="1.2rem" />
                </ThemeIcon>
                <Title order={2} size="h3" c="white">
                  {t("disclaimer.yourResponsibilities")}
                </Title>
              </Group>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  t("disclaimer.responsibility1"),
                  t("disclaimer.responsibility2"),
                  t("disclaimer.responsibility3"),
                  t("disclaimer.responsibility4"),
                  t("disclaimer.responsibility5"),
                  t("disclaimer.responsibility6"),
                ].map((responsibility, index) => (
                  <Card
                    key={index}
                    shadow="xs"
                    padding="md"
                    radius="md"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <Group gap="sm" align="flex-start" wrap="nowrap">
                      <Badge
                        size="sm"
                        color="blue"
                        variant="light"
                        radius="sm"
                        style={{ flexShrink: 0, minWidth: "24px" }}
                      >
                        {index + 1}
                      </Badge>
                      <Text
                        size="md"
                        c="dimmed"
                        style={{
                          lineHeight: 1.4,
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {responsibility}
                      </Text>
                    </Group>
                  </Card>
                ))}
              </div>
            </Stack>
          </Paper>

          {/* Final Warning */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "rgba(239, 68, 68, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              boxShadow: "0 0 20px rgba(239, 68, 68, 0.2)",
            }}
          >
            <Alert
              icon={<IconAlertTriangle size="1.5rem" />}
              title={t("disclaimer.finalWarningTitle")}
              color="red"
              variant="filled"
              radius="lg"
            >
              <Text size="md" c="white" fw={500}>
                <strong>{t("disclaimer.finalWarningText")}</strong>
              </Text>
            </Alert>
          </Paper>

          {/* Contact Information */}
          <Paper
            radius="xl"
            p="lg"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            <Text size="md" c="dimmed" ta="center">
              {t("disclaimer.contactText")}
            </Text>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
