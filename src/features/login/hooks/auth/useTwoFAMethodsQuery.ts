import { useQuery } from "@tanstack/react-query";
import { TwoFAMethodsResponse, LoginError } from "../../types/AuthTypes";

async function fetchTwoFAMethods(token: string): Promise<TwoFAMethodsResponse> {
  const response = await fetch("/api/v3/users/current/2fa-methods", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    const errorData: LoginError = await response.json();
    throw new Error(errorData.error || "Failed to fetch 2FA methods");
  }

  const data: TwoFAMethodsResponse = await response.json();
  return data;
}

export function useTwoFAMethodsQuery(token: string) {
  return useQuery({
    queryKey: ["twoFAMethods", token],
    queryFn: () => fetchTwoFAMethods(token),
    enabled: !!token,
    staleTime: 0, // Always fetch fresh data
    retry: false, // Don't retry on error
  });
}
