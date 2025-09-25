import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Get locale from cookies, default to 'en'
  const store = await cookies();
  const locale = store.get("locale")?.value || "en";

  // Validate locale - only allow 'en' and 'th'
  const validLocales = ["en", "th"];
  const finalLocale = validLocales.includes(locale) ? locale : "en";

  return {
    locale: finalLocale,
    messages: (await import(`../messages/${finalLocale}.json`)).default,
  };
});
