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
        console.log("Login successful:", response);
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
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
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
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              width: "100%",
            }}
          >
            <Stack gap="md">
              {error && (
                <Alert color="red" variant="light" radius="md">
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
                    styles={{
                      label: { color: "white", fontWeight: 500 },
                      input: {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "white",
                        "&::placeholder": { color: "rgba(255, 255, 255, 0.6)" },
                        "&:focus": {
                          borderColor: "#f97316",
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
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: "white",
                        "&::placeholder": { color: "rgba(255, 255, 255, 0.6)" },
                        "&:focus": {
                          borderColor: "#f97316",
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
                      background:
                        "linear-gradient(90deg, #f97316 0%, #ea580c 100%)",
                      border: "none",
                      fontSize: "1rem",
                      fontWeight: 600,
                      height: "2.75rem",
                      transition: "all 0.3s ease",
                    }}
                    styles={{
                      root: {
                        "&:hover": {
                          background:
                            "linear-gradient(90deg, #ea580c 0%, #dc2626 100%)",
                          transform: "scale(1.02)",
                        },
                        "&:disabled": {
                          background:
                            "linear-gradient(90deg, #fed7aa 0%, #fdba74 100%)",
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

          {/* Language Switcher */}
          <Center>
            <LanguageSwitcher />
          </Center>
        </Stack>
      </Container>
    </Box>
  );
}
