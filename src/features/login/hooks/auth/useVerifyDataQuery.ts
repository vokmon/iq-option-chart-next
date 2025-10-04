import { useQuery } from "@tanstack/react-query";
import { VerifyDataResponse, LoginError } from "../../types/AuthTypes";

async function fetchVerifyData(token: string): Promise<VerifyDataResponse> {
  const response = await fetch("/api/v2/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ method: "email", token }),
  });

  if (!response.ok) {
    const errorData: LoginError = await response.json();
    throw new Error(errorData.error || "Failed to fetch verification data");
  }

  const data: VerifyDataResponse = await response.json();
  return data;
}

export function useVerifyDataQuery(token: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["verifyData", token],
    queryFn: () => fetchVerifyData(token),
    enabled: enabled && !!token,
    staleTime: 0, // Always fetch fresh data
    retry: false, // Don't retry on error
  });
}
