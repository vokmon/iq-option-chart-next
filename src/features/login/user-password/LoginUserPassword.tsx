"use client";

import { useForm } from "@mantine/form";
import {
  Button,
  Paper,
  PasswordInput,
  TextInput,
  Alert,
  Stack,
  Anchor,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { useLoginMutation } from "../hooks/auth/useLoginMutation";
import { LoginCredentials, VerifyResponse } from "../types/AuthTypes";
import { useTranslations } from "next-intl";

type LoginUserPasswordProps = {
  onSuccess: () => void;
  onVerify: ({
    email,
    password,
    verifyResponse,
  }: {
    email: string;
    password: string;
    verifyResponse: VerifyResponse;
  }) => void;
};

export default function LoginUserPassword({
  onSuccess,
  onVerify,
}: LoginUserPasswordProps) {
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLoginMutation();
  const t = useTranslations();

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
        if (response.code === "verify") {
          const verifyResponse: VerifyResponse = response as VerifyResponse;
          onVerify({
            email: values.email,
            password: values.password,
            verifyResponse,
          });
        } else if (response.code === "success") {
          onSuccess();
        } else {
          setError(response.code || "Login failed");
        }
      },
      onError: (err) => {
        if (err.message === "User not found") {
          setError(t("User not found"));
        } else if (err.message === "User expired") {
          setError(t("User expired"));
        } else {
          setError(err instanceof Error ? err.message : "Login failed");
        }
      },
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full animate-fade-in">
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
            <Button
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
              size="md"
              radius="xl"
            >
              {t("Sign up")}
            </Button>
          </Anchor>
        </Stack>
      </Paper>
    </div>
  );
}
