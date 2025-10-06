"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Breadcrumbs, Anchor, Text } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

type BreadcrumbProps = {
  skipPath?: string[];
};

interface BreadcrumbItem {
  name: string;
  path: string;
}

const Breadcrumb = ({ skipPath }: BreadcrumbProps) => {
  const t = useTranslations();
  const pathname = usePathname();
  const pathSegments = pathname
    .split("/")
    .filter((segment: string) => segment.trim() !== ""); // Remove empty values

  const pathSegmentsToUse = skipPath
    ? pathSegments.filter((segment: string) => !skipPath.includes(segment))
    : pathSegments;

  // Reconstruct breadcrumb paths
  const breadcrumbs: BreadcrumbItem[] = pathSegmentsToUse.map(
    (segment: string, index: number) => {
      const path = `/${pathSegmentsToUse.slice(0, index + 1).join("/")}`;
      return { name: decodeURIComponent(segment), path };
    }
  );

  // If there's no valid breadcrumb, return null
  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumbs
      separator={<IconChevronRight size={16} />}
      style={{
        paddingLeft: 16,
        paddingTop: 8,
        paddingBottom: 8,
        zIndex: 1,
      }}
      data-testid="app-breadcrumb"
    >
      <Anchor
        component={Link}
        href="/"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {t("Home")}
      </Anchor>
      {breadcrumbs.map((breadcrumb: BreadcrumbItem, index: number) => {
        const isLast = index === breadcrumbs.length - 1;
        return isLast ? (
          <Text key={breadcrumb.path} c="blue" fw={600}>
            {t(breadcrumb.name)}
          </Text>
        ) : (
          <Anchor
            key={breadcrumb.path}
            component={Link}
            href={breadcrumb.path}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {t(breadcrumb.name)}
          </Anchor>
        );
      })}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
