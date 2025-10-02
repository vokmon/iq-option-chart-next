"use client";

import React, { useEffect, useRef } from "react";
import {
  Button,
  Paper,
  TextInput,
  Alert,
  Stack,
  Text,
  Group,
} from "@mantine/core";
import { useTranslations } from "next-intl";
import { IconArrowLeft } from "@tabler/icons-react";
import CountdownTimer, { CountdownTimerRef } from "./CountdownTimer";
import { VerifyResponse } from "../types/AuthTypes";
import { useVerificationCodeInput } from "../hooks/useVerificationCodeInput";
import { useVerificationSubmit } from "../hooks/useVerificationSubmit";
import { useVerificationErrors } from "../hooks/useVerificationErrors";

type VerifyStepProps = {
  verifyData: {
    email: string;
    password: string;
    verifyResponse: VerifyResponse;
  };
  onSuccess: () => void;
  onBack: () => void;
};

export default function VerifyStep({
  verifyData,
  onSuccess,
  onBack,
}: VerifyStepProps) {
  const t = useTranslations();
  const countdownTimerRef = useRef<CountdownTimerRef>(null);

  // Use custom hooks for better organization
  const {
    code,
    inputRefs,
    handleInputChange,
    handleKeyDown,
    handlePaste,
    resetCode,
    focusFirstInput,
    isCodeComplete,
  } = useVerificationCodeInput((code) => handleSubmit(code));

  const {
    handleSubmit,
    isLoading,
    verifyMutation,
    verifyDataQuery,
    twoFAMethodsQuery,
  } = useVerificationSubmit({
    verifyData,
    onSuccess,
    onError: resetCode,
  });

  const {
    hasError,
    isLoading: isDataLoading,
    errorMessage,
  } = useVerificationErrors({
    verifyMutation,
    verifyDataQuery,
    twoFAMethodsQuery,
  });

  useEffect(() => {
    // Focus first input on mount
    focusFirstInput();
  }, [focusFirstInput]);

  const handleCountdownComplete = () => {
    // Refetch 2FA methods when countdown completes
    twoFAMethodsQuery.refetch();
  };

  return (
    <div className="flex flex-col gap-4 w-full">
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
          {/* Header */}
          <Stack gap="xs" align="center">
            <Text c="white" size="lg" fw={600} ta="center">
              {t("Verification Code")}
            </Text>
            <Text c="dimmed" size="sm" ta="center">
              {t("Enter the 5-digit code sent to")}{" "}
            </Text>
            <Text fw={600} c="white" size="lg">
              {verifyData.email}
            </Text>
          </Stack>

          {hasError && (
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
              {t(errorMessage)}
            </Alert>
          )}

          {isDataLoading && (
            <Alert
              color="blue"
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
                  color: "var(--mantine-color-blue-6)",
                  fontWeight: 500,
                },
              }}
            >
              Loading verification data...
            </Alert>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(code.join(""));
            }}
          >
            <Stack gap="lg" align="center">
              {/* Code Input Fields */}
              <Group gap="sm" justify="center">
                {code.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    maxLength={1}
                    size="lg"
                    radius="md"
                    disabled={isLoading}
                    styles={{
                      input: {
                        width: "3.5rem",
                        height: "3rem",
                        textAlign: "center",
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        backgroundColor: "var(--glass-bg)",
                        border: "1px solid var(--glass-border)",
                        color: "white",
                        "&:focus": {
                          borderColor: "var(--color-primary-500)",
                          boxShadow: "0 0 0 2px rgba(249, 115, 22, 0.2)",
                        },
                      },
                    }}
                  />
                ))}
              </Group>

              {/* Action Buttons */}
              <Stack gap="sm" w="100%">
                <Button
                  loading={isLoading}
                  fullWidth
                  size="md"
                  radius="xl"
                  type="submit"
                  disabled={isLoading || !isCodeComplete}
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
                      color: "white",
                      "&:hover": {
                        background: "var(--gradient-primary-button-hover)",
                        transform: "scale(1.02)",
                        color: "white",
                      },
                      "&:disabled": {
                        background: "var(--gradient-primary-button-disabled)",
                        transform: "scale(1)",
                        color: "white",
                      },
                    },
                  }}
                >
                  {isLoading ? t("Verifying") : t("Verify Code")}
                </Button>

                <Group justify="space-between" w="100%">
                  <Button
                    variant="subtle"
                    color="white"
                    leftSection={<IconArrowLeft size={16} />}
                    onClick={onBack}
                    disabled={isLoading}
                    styles={{
                      root: {
                        color: "white",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      },
                    }}
                  >
                    {t("Back")}
                  </Button>

                  <CountdownTimer
                    ref={countdownTimerRef}
                    initialSeconds={verifyDataQuery.data?.ttl || 58}
                    onComplete={handleCountdownComplete}
                  />
                </Group>
              </Stack>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </div>
  );
}
