import { useCallback } from "react";
import { useVerifyMutation } from "./auth/useVerifyMutation";
import { useVerifyDataQuery } from "./auth/useVerifyDataQuery";
import { useTwoFAMethodsQuery } from "./auth/useTwoFAMethodsQuery";
import { useLoginMutation } from "./auth/useLoginMutation";
import { VerifyResponse, VerifyApiResponse } from "../types/AuthTypes";

type UseVerificationSubmitProps = {
  verifyData: {
    email: string;
    password: string;
    verifyResponse: VerifyResponse;
  };
  onSuccess: () => void;
  onError: () => void;
};

export const useVerificationSubmit = ({
  verifyData,
  onSuccess,
  onError,
}: UseVerificationSubmitProps) => {
  const verifyMutation = useVerifyMutation();
  const loginMutation = useLoginMutation();
  const verifyDataQuery = useVerifyDataQuery(verifyData.verifyResponse.token);
  const twoFAMethodsQuery = useTwoFAMethodsQuery(
    verifyDataQuery.data?.token || ""
  );

  const handleSubmit = useCallback(
    async (verificationCode: string) => {
      if (verificationCode.length !== 5) {
        return;
      }

      // Use the fresh token from the query if available, otherwise fall back to the original token
      const tokenToUse =
        verifyDataQuery.data?.token || verifyData.verifyResponse.token;

      try {
        // Step 1: Verify the code
        const verifyResult: VerifyApiResponse =
          await verifyMutation.mutateAsync({
            code: verificationCode,
            token: tokenToUse,
          });

        // Step 2: Call login with the token from verification
        await loginMutation.mutateAsync({
          identifier: verifyData.email,
          password: verifyData.password,
          token: verifyResult.token,
        });

        onSuccess();
      } catch {
        onError();
      }
    },
    [
      verifyData.email,
      verifyData.password,
      verifyData.verifyResponse.token,
      verifyDataQuery.data?.token,
      verifyMutation,
      loginMutation,
      onSuccess,
      onError,
    ]
  );

  const isLoading =
    verifyMutation.isPending ||
    loginMutation.isPending ||
    verifyDataQuery.isLoading ||
    twoFAMethodsQuery.isLoading;

  return {
    handleSubmit,
    isLoading,
    verifyMutation,
    loginMutation,
    verifyDataQuery,
    twoFAMethodsQuery,
  };
};
