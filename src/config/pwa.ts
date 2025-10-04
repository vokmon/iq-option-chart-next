import type { Metadata } from "next";
import { APP_METADATA } from "@/constants/app";

export const pwaMetadata: Metadata = {
  title: APP_METADATA.name,
  description: APP_METADATA.description,
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_METADATA.name,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_METADATA.name,
    title: APP_METADATA.name,
    description: APP_METADATA.description,
  },
  icons: {
    icon: "/icons/icon-192x192.svg",
    shortcut: "/icons/icon-192x192.svg",
    apple: "/icons/icon-192x192.svg",
  },
};
