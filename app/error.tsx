"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@mantine/core";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-md w-full mx-4">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-error to-red-600 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-error to-red-500 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl font-bold text-foreground mb-4">
            {t("Something went wrong!")}
          </h1>
          <p className="text-dark-400 mb-8 text-lg">{t("Error Message")}</p>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-lg text-left">
              <h3 className="text-sm font-semibold text-red-400 mb-2">
                {t("Error Details")}:
              </h3>
              <p className="text-xs text-red-300 font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-400 mt-2">
                  {t("Error ID")}: {error.digest}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={reset}
              size="lg"
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
              className="w-full sm:w-auto"
            >
              {t("Try Again")}
            </Button>

            <div className="pt-4">
              <Button
                component={Link}
                href="/"
                variant="subtle"
                color="orange"
                className="text-primary-400 hover:text-primary-300"
              >
                ← {t("Go Home")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
