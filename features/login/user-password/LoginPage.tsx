"use client";

import { Container, Title, Box, Stack, Center } from "@mantine/core";
import { useMantineTheme } from "@mantine/core";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/display/language/LanguageSwitcher";
import LoginUserPassword from "./LoginUserPassword";
import { useState } from "react";
import VerifyStep from "./VerifyStep";
import { VerifyResponse } from "../types/AuthTypes";

const DEFAULT_STEP = "login";
const DEFAULT_ROUTE = "/";

export default function LoginPage() {
  const router = useRouter();
  const theme = useMantineTheme();
  const [step, setStep] = useState<"login" | "verify">(DEFAULT_STEP);
  const [verifyData, setVerifyData] = useState<{
    email: string;
    password: string;
    verifyResponse: VerifyResponse;
  }>({
    email: "",
    password: "",
    verifyResponse: { code: "", method: "", token: "" },
  });

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
      className="animate-fade-in"
    >
      <Container size={420} w="100%">
        <Stack gap="lg" align="center">
          {/* Header */}
          <Stack gap="sm" align="center">
            <Title order={1} size="2.5rem" fw={700} c="white" ta="center">
              IQ Option
            </Title>
          </Stack>

          {/* Login Card */}
          {step === "login" && (
            <LoginUserPassword
              onSuccess={() => router.push(DEFAULT_ROUTE)}
              onVerify={(data) => {
                setVerifyData(data);
                setStep("verify");
              }}
            />
          )}
          {step === "verify" && (
            <VerifyStep
              verifyData={verifyData}
              onSuccess={() => router.push(DEFAULT_ROUTE)}
              onBack={() => setStep("login")}
            />
          )}

          {/* Language Switcher */}
          <Center>
            <LanguageSwitcher />
          </Center>
        </Stack>
      </Container>
    </Box>
  );
}
