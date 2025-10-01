"use client";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@mantine/core";

export default function NotFound() {
  const t = useTranslations();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <div className="max-w-md w-full mx-4">
        <div className="text-center">
          {/* Page Not Found Animation */}
          <div className="mb-8">
            <div className="text-5xl font-bold text-primary-500 mb-4 animate-pulse">
              {t("Page Not Found")}
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
          </div>

          {/* Error Message */}
          <p className="text-dark-400 mb-8 text-lg">{t("404 Error Message")}</p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              component={Link}
              href="/"
              size="lg"
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
              className="w-full sm:w-auto"
            >
              {t("Go Home")}
            </Button>

            <div className="pt-4">
              <Button
                variant="subtle"
                color="orange"
                onClick={() => window.history.back()}
                className="text-primary-400 hover:text-primary-300"
              >
                {t("Go Back")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
