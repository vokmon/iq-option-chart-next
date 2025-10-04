import type { Metadata, Viewport } from "next";
import { APP_METADATA } from "@/constants/app";

export const pwaMetadata: Metadata = {
  title: APP_METADATA.name,
  description: APP_METADATA.description,
  manifest: "/manifest.json",
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

export const pwaViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000",
};
