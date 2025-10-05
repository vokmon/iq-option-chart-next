"use client";

import { Container, Box, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import LoginUserPassword from "./LoginUserPassword";
import { useState } from "react";
import VerifyStep from "./VerifyStep";
import { VerifyResponse } from "../types/AuthTypes";

const DEFAULT_STEP = "login";
const DEFAULT_ROUTE = "/";

export default function LoginPage() {
  const router = useRouter();
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
    <Box className="animate-fade-in h-full w-full self-center">
      <Container size={420} w="100%" h="100%">
        <Stack gap="lg" align="center">
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
        </Stack>
      </Container>
    </Box>
  );
}
