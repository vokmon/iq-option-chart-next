"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/display/language/LanguageSwitcher";
import { OAuthMethod } from "@quadcode-tech/client-sdk-js";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Box,
  Alert,
  Stack,
  Center,
  Loader,
} from "@mantine/core";
import { useMantineTheme } from "@mantine/core";

const CLIENT_ID = process.env.NEXT_PUBLIC_IQ_OPTION_CLIENT_ID;

export default function LoginIqOptionOAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const t = useTranslations();
  const theme = useMantineTheme();

  const handleIQOptionLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const oauth = new OAuthMethod(
        "/auth/oauth.v5/authorize",
        Number(CLIENT_ID!), // your client ID (you can request CLIENT_ID and CLIENT_SECRET by creating an issue on GitHub)
        "/auth/iqoption/callback", // redirect URI
        "full" // scope (e.g. 'full' or 'full offline_access')
      );

      const { url, codeVerifier } = await oauth.createAuthorizationUrl();
      // sessionStorage.setItem("pkce_verifier", codeVerifier);
      // window.location.href = url;
      console.log(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
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
      <Container size="xs" w="100%">
        <Stack gap="xl" align="center">
          {/* Header */}
          <Stack gap="md" align="center">
            <Title order={1} size="3rem" fw={700} c="white" ta="center">
              IQ Option
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              {t("Advanced trading charts with technical indicators")}
            </Text>
          </Stack>

          {/* Login Card */}
          <Paper
            radius="xl"
            p="xl"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(10px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
              width: "100%",
            }}
          >
            <Stack gap="xl">
              {error && (
                <Alert color="red" variant="light" radius="md">
                  {error}
                </Alert>
              )}

              {/* Welcome Message */}
              <Stack gap="md" align="center">
                <Title order={2} size="1.5rem" fw={600} c="white" ta="center">
                  {t("Welcome")}
                </Title>
                <Text c="dimmed" ta="center">
                  {t("Please login to continue")}
                </Text>
              </Stack>

              {/* IQ Option OAuth Button */}
              <Button
                onClick={handleIQOptionLogin}
                loading={isLoading}
                disabled={isLoading}
                size="lg"
                radius="xl"
                fullWidth
                style={{
                  background: "var(--gradient-primary-button)",
                  border: "none",
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  height: "3.5rem",
                  transition: "all 0.3s ease",
                  transform: isLoading ? "scale(1)" : "scale(1)",
                }}
                styles={{
                  root: {
                    "&:hover": {
                      background: "var(--gradient-primary-button-hover)",
                      transform: "scale(1.05)",
                    },
                    "&:disabled": {
                      background: "var(--gradient-primary-button-disabled)",
                      transform: "scale(1)",
                    },
                  },
                }}
              >
                {isLoading ? (
                  <Center>
                    <Loader size="sm" color="white" mr="sm" />
                    {t("Signing in")}
                  </Center>
                ) : (
                  "Sign in"
                )}
              </Button>

              {/* Terms and Privacy */}
              <Text size="xs" c="dimmed" ta="center">
                By continuing, you agree to our{" "}
                <Text
                  component="a"
                  href="#"
                  c="primary.5"
                  td="underline"
                  style={{ cursor: "pointer" }}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  component="a"
                  href="#"
                  c="primary.5"
                  td="underline"
                  style={{ cursor: "pointer" }}
                >
                  Privacy Policy
                </Text>
              </Text>
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
