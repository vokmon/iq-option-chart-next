"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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

const CLIENT_ID = process.env.NEXT_PUBLIC_IQ_OPTION_CLIENT_ID;
const IQ_OPTION_API_URL = process.env.NEXT_PUBLIC_IQ_OPTION_API_URL;
const IQ_OPTION_ALLOW_SCOPE = process.env.NEXT_PUBLIC_IQ_OPTION_ALLOW_SCOPE;

export default function LoginIqOptionOAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  const handleIQOptionLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const oauth = new OAuthMethod(
        IQ_OPTION_API_URL!,
        Number(CLIENT_ID!),
        `${window.location.origin}/auth/iqoption/callback`,
        IQ_OPTION_ALLOW_SCOPE!
      );

      const { url, codeVerifier } = await oauth.createAuthorizationUrl();
      sessionStorage.setItem("pkce_verifier", codeVerifier);
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box className="animate-fade-in flex flex-col items-center justify-center">
      <Container size="xs" w="100%">
        <Stack gap="xl" align="center">
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
                  t("Sign in")
                )}
              </Button>

              {/* Terms and Privacy */}
              <Text size="xs" c="dimmed" ta="center">
                By continuing, you agree to our{" "}
                <Text
                  component="a"
                  href="/disclaimer"
                  c="primary.5"
                  td="underline"
                  style={{ cursor: "pointer" }}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  component="a"
                  href="/privacy-policy"
                  c="primary.5"
                  td="underline"
                  style={{ cursor: "pointer" }}
                >
                  Privacy Policy
                </Text>
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
