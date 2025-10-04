import { useMemo } from "react";

type UseVerificationErrorsProps = {
  verifyMutation: {
    error: Error | null;
  };
  verifyDataQuery: {
    error: Error | null;
    isLoading: boolean;
  };
  twoFAMethodsQuery: {
    error: Error | null;
    isLoading: boolean;
  };
};

export const useVerificationErrors = ({
  verifyMutation,
  verifyDataQuery,
  twoFAMethodsQuery,
}: UseVerificationErrorsProps) => {
  const hasError = useMemo(
    () =>
      !!(
        verifyMutation.error ||
        verifyDataQuery.error ||
        twoFAMethodsQuery.error
      ),
    [verifyMutation.error, verifyDataQuery.error, twoFAMethodsQuery.error]
  );

  const isLoading = useMemo(
    () => verifyDataQuery.isLoading || twoFAMethodsQuery.isLoading,
    [verifyDataQuery.isLoading, twoFAMethodsQuery.isLoading]
  );

  const errorMessage = useMemo(() => {
    if (verifyMutation.error instanceof Error) {
      return verifyMutation.error.message;
    }
    if (verifyDataQuery.error instanceof Error) {
      return verifyDataQuery.error.message;
    }
    if (twoFAMethodsQuery.error instanceof Error) {
      return twoFAMethodsQuery.error.message;
    }
    return "Verification failed";
  }, [verifyMutation.error, verifyDataQuery.error, twoFAMethodsQuery.error]);

  return {
    hasError,
    isLoading,
    errorMessage,
  };
};
