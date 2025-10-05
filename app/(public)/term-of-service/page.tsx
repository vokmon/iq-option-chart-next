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
  List,
} from "@mantine/core";
import {
  IconGavel,
  IconUserCheck,
  IconShield,
  IconAlertTriangle,
  IconInfoCircle,
  IconExclamationMark,
  IconLock,
  IconUserX,
  IconSettings,
  IconMail,
  IconBan,
  IconCheck,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import { useMantineTheme } from "@mantine/core";
import { APP_METADATA } from "../../../src/constants/app";
import IqOptionLink from "@/components/display/links/IqOptionLink";

export default function TermsOfServicePage() {
  const t = useTranslations("terms");
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
            }}
          >
            <Group gap="md" mb="md">
              <ThemeIcon
                size="xl"
                radius="xl"
                style={{
                  background:
                    "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                <IconGavel size={28} />
              </ThemeIcon>
              <div>
                <Title order={1} c="white" size="h1">
                  {t("title")}
                </Title>
                <Text c="dimmed" size="lg">
                  {t("subtitle")}
                </Text>
              </div>
            </Group>
            <Alert
              icon={<IconInfoCircle size={20} />}
              title={t("importantNotice")}
              color="blue"
              variant="light"
              radius="md"
            >
              <Text c="dimmed">{t("importantNoticeText")}</Text>
            </Alert>
          </Paper>

          {/* Last Updated */}
          <Card radius="lg" p="md" style={{ background: "var(--glass-bg)" }}>
            <Group gap="sm">
              <IconInfoCircle size={16} color="var(--mantine-color-blue-6)" />
              <Text size="sm" c="dimmed">
                <strong>{t("lastUpdated")}:</strong>{" "}
                {new Date().toLocaleDateString()}
              </Text>
            </Group>
          </Card>

          {/* 1. Acceptance of Terms */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="blue">
                <IconCheck size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("acceptanceTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("acceptanceText")}
            </Text>
            <List spacing="sm" c="dimmed">
              <List.Item>{t("acceptance1")}</List.Item>
              <List.Item>{t("acceptance2")}</List.Item>
              <List.Item>{t("acceptance3")}</List.Item>
            </List>
          </Paper>

          {/* 2. Service Description */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="green">
                <IconSettings size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("serviceTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("serviceText")}
            </Text>
            <List spacing="sm" c="dimmed">
              <List.Item>{t("service1")}</List.Item>
              <List.Item>{t("service2")}</List.Item>
              <List.Item>{t("service3")}</List.Item>
              <List.Item>{t("service4")}</List.Item>
            </List>
            <Alert
              icon={<IconAlertTriangle size={20} />}
              title={t("serviceImportant")}
              color="orange"
              variant="light"
              radius="md"
              mt="md"
            >
              <Text c="dimmed">{t("serviceImportantText")}</Text>
            </Alert>
          </Paper>

          {/* 3. User Accounts */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="violet">
                <IconUserCheck size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("accountsTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("accountsText")}
            </Text>
            <List spacing="sm" c="dimmed">
              <List.Item>{t("accounts1")}</List.Item>
              <List.Item>{t("accounts2")}</List.Item>
              <List.Item>{t("accounts3")}</List.Item>
              <List.Item>{t("accounts4")}</List.Item>
              <List.Item>
                {t("accounts5")} <IqOptionLink path="/profile" />.
              </List.Item>
              <List.Item>
                {t("accounts6")} <IqOptionLink path="/profile" />.
              </List.Item>
            </List>
          </Paper>

          {/* 4. Prohibited Uses */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="red">
                <IconBan size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("prohibitedTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("prohibitedText")}
            </Text>
            <List spacing="sm" c="dimmed">
              <List.Item>{t("prohibited1")}</List.Item>
              <List.Item>{t("prohibited2")}</List.Item>
              <List.Item>{t("prohibited3")}</List.Item>
              <List.Item>{t("prohibited4")}</List.Item>
              <List.Item>{t("prohibited5")}</List.Item>
              <List.Item>{t("prohibited6")}</List.Item>
              <List.Item>{t("prohibited7")}</List.Item>
            </List>
          </Paper>

          {/* 5. Risk Disclosure */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="orange">
                <IconAlertTriangle size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("riskTitle")}
              </Title>
            </Group>
            <Alert
              icon={<IconExclamationMark size={20} />}
              title={t("riskWarning")}
              color="red"
              variant="light"
              radius="md"
              mb="md"
            >
              <Text c="dimmed">{t("riskWarningText")}</Text>
            </Alert>
            <Text c="dimmed" mb="md">
              {t("riskText")}
            </Text>
            <List spacing="sm" c="dimmed">
              <List.Item>{t("risk1")}</List.Item>
              <List.Item>{t("risk2")}</List.Item>
              <List.Item>{t("risk3")}</List.Item>
              <List.Item>{t("risk4")}</List.Item>
              <List.Item>{t("risk5")}</List.Item>
            </List>
          </Paper>

          {/* 6. Intellectual Property */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="indigo">
                <IconShield size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("ipTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("ipText")}
            </Text>
            <List spacing="sm" c="dimmed">
              <List.Item>{t("ip1")}</List.Item>
              <List.Item>{t("ip2")}</List.Item>
              <List.Item>{t("ip3")}</List.Item>
            </List>
          </Paper>

          {/* 7. Privacy */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="teal">
                <IconLock size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("privacyTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("privacyText")}
            </Text>
            <Alert
              icon={<IconInfoCircle size={20} />}
              title={t("privacyData")}
              color="blue"
              variant="light"
              radius="md"
            >
              <Text c="dimmed">{t("privacyDataText")}</Text>
            </Alert>
          </Paper>

          {/* 8. Termination */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="red">
                <IconUserX size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("terminationTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("terminationText")}
            </Text>
            <List spacing="sm" c="dimmed">
              <List.Item>{t("termination1")}</List.Item>
              <List.Item>{t("termination2")}</List.Item>
              <List.Item>{t("termination3")}</List.Item>
              <List.Item>{t("termination4")}</List.Item>
            </List>
          </Paper>

          {/* 9. Disclaimers */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="gray">
                <IconExclamationMark size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("disclaimersTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("disclaimersText")}
            </Text>
            <List spacing="sm" c="dimmed">
              <List.Item>{t("disclaimers1")}</List.Item>
              <List.Item>{t("disclaimers2")}</List.Item>
              <List.Item>{t("disclaimers3")}</List.Item>
              <List.Item>{t("disclaimers4")}</List.Item>
            </List>
          </Paper>

          {/* 10. Limitation of Liability */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="dark">
                <IconGavel size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("liabilityTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("liabilityText")}
            </Text>
            <List spacing="sm" c="dimmed">
              <List.Item>{t("liability1")}</List.Item>
              <List.Item>{t("liability2")}</List.Item>
              <List.Item>{t("liability3")}</List.Item>
              <List.Item>{t("liability4")}</List.Item>
            </List>
          </Paper>

          {/* 11. Governing Law */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="blue">
                <IconGavel size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("governingTitle")}
              </Title>
            </Group>
            <Text c="dimmed">{t("governingText")}</Text>
          </Paper>

          {/* 12. Changes to Terms */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="cyan">
                <IconSettings size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("changesTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("changesText")}
            </Text>
            <Alert
              icon={<IconInfoCircle size={20} />}
              title={t("changesContinued")}
              color="blue"
              variant="light"
              radius="md"
            >
              <Text c="dimmed">{t("changesContinuedText")}</Text>
            </Alert>
          </Paper>

          {/* Contact Information */}
          <Paper radius="lg" p="xl" style={{ background: "var(--glass-bg)" }}>
            <Group gap="md" mb="md">
              <ThemeIcon size="lg" radius="xl" color="green">
                <IconMail size={20} />
              </ThemeIcon>
              <Title order={2} c="white">
                {t("contactTitle")}
              </Title>
            </Group>
            <Text c="dimmed" mb="md">
              {t("contactText")}
            </Text>
            <Card
              radius="md"
              p="md"
              style={{ background: "var(--mantine-color-dark-7)" }}
            >
              <Stack gap="sm">
                <Group gap="sm">
                  <IconMail size={16} />
                  <Text c="dimmed" size="sm">
                    {t("contactEmail", {
                      supportEmail: APP_METADATA.supportEmail,
                    })}
                  </Text>
                </Group>
                <Group gap="sm">
                  <IconInfoCircle size={16} />
                  <Text c="dimmed" size="sm">
                    {t("contactResponse")}
                  </Text>
                </Group>
              </Stack>
            </Card>
          </Paper>

          {/* Footer */}
          <Paper radius="lg" p="md" style={{ background: "var(--glass-bg)" }}>
            <Text size="sm" c="dimmed" ta="center">
              {t("footerText")}
            </Text>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
