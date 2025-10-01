"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@mantine/core";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const t = useTranslations();
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 min-h-screen">
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-md w-full mx-4">
            <div className="text-center">
              {/* Critical Error Icon */}
              <div className="mb-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-red-500 mx-auto rounded-full"></div>
              </div>

              {/* Error Message */}
              <h1 className="text-4xl font-bold text-white mb-4">
                {t("Critical Error")}
              </h1>
              <p className="text-gray-300 mb-8 text-lg">
                {t("Critical Error Message")}
              </p>

              {/* Error Details (only in development) */}
              {process.env.NODE_ENV === "development" && (
                <div className="mb-8 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-left">
                  <h3 className="text-sm font-semibold text-red-300 mb-2">
                    {t("Error Details")}:
                  </h3>
                  <p className="text-xs text-red-200 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-300 mt-2">
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
                  gradient={{ from: "red", to: "pink" }}
                  className="w-full sm:w-auto"
                >
                  {t("Try Again")}
                </Button>

                <div className="pt-4">
                  <Button
                    onClick={() => (window.location.href = "/")}
                    variant="subtle"
                    color="red"
                    className="text-red-400 hover:text-red-300"
                  >
                    {t("Go to Homepage")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
