import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "../lib/query-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { theme } from "../theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IQ Option Chart",
  description: "IQ Option Chart",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <MantineProvider theme={theme}>
              <NuqsAdapter>{children}</NuqsAdapter>
            </MantineProvider>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
