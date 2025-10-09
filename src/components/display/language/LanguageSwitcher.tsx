"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Group } from "@mantine/core";

export default function LanguageSwitcher() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  const changeLanguage = async (newLocale: string) => {
    if (newLocale === locale) return; // Don't change if already selected

    setIsChanging(true);

    // Set the locale cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Refresh the page to apply the new locale
    router.refresh();

    setIsChanging(false);
  };

  return (
    <div style={{ padding: "8px 10px" }}>
      <Group gap="xs">
        <Group gap="xs">
          <Button
            size="xs"
            variant={locale === "en" ? "filled" : "outline"}
            color={locale === "en" ? "blue" : "gray"}
            onClick={() => changeLanguage("en")}
            disabled={isChanging}
            leftSection="🇺🇸"
          >
            {t("English")}
          </Button>

          <Button
            size="xs"
            variant={locale === "th" ? "filled" : "outline"}
            color={locale === "th" ? "blue" : "gray"}
            onClick={() => changeLanguage("th")}
            disabled={isChanging}
            leftSection="🇹🇭"
          >
            {t("Thai")}
          </Button>
        </Group>
      </Group>
    </div>
  );
}
