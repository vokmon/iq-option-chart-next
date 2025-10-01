import { useMutation } from "@tanstack/react-query";
import { VerifyCredentials, LoginError } from "../../types/AuthTypes";

async function verifyCode(credentials: VerifyCredentials): Promise<void> {
  const response = await fetch("/api/v2/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData: LoginError = await response.json();
    throw new Error(errorData.error || "Verification failed");
  }

  const data = await response.json();
  return data;
}

export function useVerifyMutation() {
  return useMutation({
    mutationFn: verifyCode,
    retry: false,
  });
}
