import { useCallback } from "react";
import { useVerifyMutation } from "./auth/useVerifyMutation";
import { useVerifyDataQuery } from "./auth/useVerifyDataQuery";
import { useTwoFAMethodsQuery } from "./auth/useTwoFAMethodsQuery";
import { VerifyResponse } from "../types/AuthTypes";

type UseVerificationSubmitProps = {
  verifyData: {
    email: string;
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

      verifyMutation.mutate(
        {
          code: verificationCode,
          token: tokenToUse,
        },
        {
          onSuccess: () => {
            onSuccess();
          },
          onError: () => {
            onError();
          },
        }
      );
    },
    [
      verifyData.verifyResponse.token,
      verifyDataQuery.data?.token,
      verifyMutation,
      onSuccess,
      onError,
    ]
  );

  const isLoading =
    verifyMutation.isPending ||
    verifyDataQuery.isLoading ||
    twoFAMethodsQuery.isLoading;

  return {
    handleSubmit,
    isLoading,
    verifyMutation,
    verifyDataQuery,
    twoFAMethodsQuery,
  };
};
