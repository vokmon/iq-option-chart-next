import { useMutation } from "@tanstack/react-query";

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface LoginResponse {
  code: string;
  company_id: number;
  created_at: number;
  ssid: string;
  user_id: number;
}

export interface LoginError {
  error: string;
  details?: string;
}

async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
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
  });
}
