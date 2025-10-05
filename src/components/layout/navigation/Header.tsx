import { Group, Text, Box, Image } from "@mantine/core";
import { APP_METADATA } from "@/constants/app";
import LanguageSwitcher from "@/components/display/language/LanguageSwitcher";
import Link from "next/link";

export default function Header() {
  return (
    <Box
      style={{
        background: "var(--gradient-primary)",
        borderBottom: "1px solid var(--glass-border)",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Left side - App title or logo */}
      <Link href="/">
        <Group className="cursor-pointer">
          <div className="w-10 h-10">
            <Image
              src="/icons/icon.svg"
              alt={APP_METADATA.name}
              width={32}
              height={32}
            />
          </div>

          <Text
            size="xl"
            fw={700}
            c="white"
            style={{
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              letterSpacing: "0.5px",
            }}
          >
            {APP_METADATA.name}
          </Text>
        </Group>
      </Link>

      {/* Right side - Language Switcher */}
      <Group>
        <LanguageSwitcher />
      </Group>
    </Box>
  );
}
