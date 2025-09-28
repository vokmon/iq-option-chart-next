"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  Container,
  Paper,
  PasswordInput,
  TextInput,
  Title,
  Alert,
  Box,
  Stack,
  Center,
  Text,
  Anchor,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation, LoginCredentials } from "../../lib/auth";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/display/language/LanguageSwitcher";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const t = useTranslations();
  const theme = useMantineTheme();

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    setError(null);

    const credentials: LoginCredentials = {
      identifier: values.email,
      password: values.password,
    };

    loginMutation.mutate(credentials, {
      onSuccess: (response) => {
        // Store user data in localStorage
        localStorage.setItem(
          "user",
          JSON.stringify({
            user_id: response.user_id,
            company_id: response.company_id,
            ssid: response.ssid,
            code: response.code,
            created_at: response.created_at,
          })
        );
        // Redirect to dashboard or main page after successful login
        router.push("/");
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : "Login failed");
      },
    });
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "var(--gradient-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing.md,
      }}
    >
      <Container size={420} w="100%">
        <Stack gap="lg" align="center">
          {/* Header */}
          <Stack gap="sm" align="center">
            <Title order={1} size="2.5rem" fw={700} c="white" ta="center">
              IQ Option
            </Title>
            <Title order={2} size="1.25rem" fw={400} c="dimmed" ta="center">
              {t("Welcome")} to IQ Option
            </Title>
          </Stack>

          {/* Login Card */}
          <Paper
            radius="xl"
            p="lg"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
              width: "100%",
            }}
          >
            <Stack gap="md">
              {error && (
                <Alert
                  color="red"
                  variant="light"
                  radius="md"
                  styles={{
                    root: {
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid var(--glass-border)",
                      boxShadow: "var(--glass-shadow)",
                    },
                    message: {
                      color: "var(--mantine-color-red-6)",
                      fontWeight: 500,
                    },
                  }}
                >
                  {error}
                </Alert>
              )}

              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                  <TextInput
                    label={t("Email")}
                    placeholder="username@domain.com"
                    required
                    radius="md"
                    key={form.key("email")}
                    {...form.getInputProps("email")}
                    disabled={loginMutation.isPending}
                    autoFocus
                    styles={{
                      label: { color: "white", fontWeight: 500 },
                      input: {
                        backgroundColor: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: "white",
                        "&::placeholder": { color: "rgba(255, 255, 255, 0.6)" },
                        "&:focus": {
                          borderColor: "var(--color-primary-500)",
                          boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.2)",
                        },
                      },
                    }}
                  />
                  <PasswordInput
                    label={t("Password")}
                    placeholder="password"
                    key={form.key("password")}
                    {...form.getInputProps("password")}
                    required
                    radius="md"
                    disabled={loginMutation.isPending}
                    styles={{
                      label: { color: "white", fontWeight: 500 },
                      input: {
                        backgroundColor: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: "white",
                        "&::placeholder": { color: "rgba(255, 255, 255, 0.6)" },
                        "&:focus": {
                          borderColor: "var(--color-primary-500)",
                          boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.2)",
                        },
                      },
                      innerInput: {
                        color: "white",
                        "&::placeholder": { color: "rgba(255, 255, 255, 0.6)" },
                      },
                    }}
                  />
                  <Button
                    loading={loginMutation.isPending}
                    fullWidth
                    size="md"
                    radius="xl"
                    type="submit"
                    disabled={loginMutation.isPending}
                    style={{
                      background: "var(--gradient-primary-button)",
                      border: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      height: "2.75rem",
                      transition: "all 0.3s ease",
                    }}
                    styles={{
                      root: {
                        "&:hover": {
                          background: "var(--gradient-primary-button-hover)",
                          transform: "scale(1.02)",
                        },
                        "&:disabled": {
                          background: "var(--gradient-primary-button-disabled)",
                          transform: "scale(1)",
                        },
                      },
                    }}
                  >
                    {loginMutation.isPending ? t("Signing in") : t("Sign in")}
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Paper>

          {/* Sign Up Section */}
          <Paper
            radius="lg"
            p="md"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              width: "100%",
            }}
          >
            <Stack gap="sm" align="center">
              <Text c="white" size="sm" ta="center">
                {t("Don't have an account yet?")}
              </Text>
              <Anchor
                href="https://iqbroker.com/lp/mobile-partner-pwa/en/?aff=261925&aff_model=revenue"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
              >
                <button className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-400/50 text-white px-8 py-3 rounded-xl font-semibold text-base hover:from-orange-500/30 hover:to-red-500/30 hover:border-orange-400 hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-orange-500/25">
                  {t("Sign up")}
                </button>
              </Anchor>
            </Stack>
          </Paper>

          {/* Language Switcher */}
          <Center>
            <LanguageSwitcher />
          </Center>
        </Stack>
      </Container>
    </Box>
  );
}
