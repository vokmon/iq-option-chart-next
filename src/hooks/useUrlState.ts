import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Custom hook for managing URL-based state
 * @param key - The URL parameter key
 * @param defaultValue - Default value if parameter is not present
 * @returns [value, setValue] - Current value and setter function
 */
export function useUrlState(
  key: string,
  defaultValue: string
): [string, (value: string | null) => void] {
  const searchParams = useSearchParams();
  const router = useRouter();

  const value = searchParams.get(key) || defaultValue;

  const setValue = useCallback(
    (newValue: string | null) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      if (newValue !== null && newValue !== undefined) {
        newSearchParams.set(key, newValue);
      } else {
        newSearchParams.delete(key);
      }

      router.push(`?${newSearchParams.toString()}`);
    },
    [key, searchParams, router]
  );

  return [value, setValue];
}
