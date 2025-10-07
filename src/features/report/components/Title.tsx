import { useTranslations } from "next-intl";
import React from "react";

export default function Title() {
  const t = useTranslations();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {t("Trading Report")}
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
        {t(
          "Analyze your trading performance and track your progress over time"
        )}
      </p>
    </div>
  );
}
