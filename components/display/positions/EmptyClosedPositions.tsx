import { Box, Center, Stack, Text } from "@mantine/core";
import { IconTable } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

// Empty state component for closed positions
export const EmptyClosedPositions = () => {
  const t = useTranslations();

  return (
    <Box className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-bottom-5 duration-600">
      <Center className="mb-4">
        <Box
          className="flex items-center justify-center w-16 h-16 rounded-full animate-bounce"
          style={{
            background:
              "linear-gradient(135deg, var(--mantine-color-blue-1) 0%, var(--mantine-color-blue-2) 50%, var(--mantine-color-blue-3) 100%)",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)",
            animationDuration: "2s",
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-in-out",
          }}
        >
          <IconTable
            size={32}
            style={{
              background:
                "linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          />
        </Box>
      </Center>
      <Stack gap="xs" align="center">
        <Text size="lg" fw={600} c="gray.7">
          {t("No trading history")}
        </Text>
        <Text size="sm" c="gray.6" ta="center" maw={300}>
          {t("You haven't started trading yet")}
        </Text>
        <Text size="xs" c="gray.5" ta="center" maw={280}>
          {t("Place your first trade to see your positions here")}
        </Text>
      </Stack>
    </Box>
  );
};
