import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["static.cdnroute.io"],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
