import { useMutation } from "@tanstack/react-query";
import {
  LoginCredentials,
  LoginResponse,
  VerifyResponse,
  LoginError,
} from "../../types/AuthTypes";

async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse | VerifyResponse> {
  const response = await fetch("/api/v2/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const errorData: LoginError = await response.json();
    throw new Error(errorData.error || "Login failed");
  }

  const data: LoginResponse = await response.json();
  return data;
}

export function useLoginMutation() {
  return useMutation({
    mutationFn: loginUser,
    retry: false,
  });
}
