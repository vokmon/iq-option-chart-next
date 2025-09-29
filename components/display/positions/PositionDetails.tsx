import { Group, Text, Stack, Divider } from "@mantine/core";
import { Position } from "@quadcode-tech/client-sdk-js";
import { formatDateTime } from "@/utils/dateTime";
import { useTranslations } from "next-intl";

interface PositionDetailsProps {
  position: Position;
}

export default function PositionDetails({ position }: PositionDetailsProps) {
  const t = useTranslations();

  return (
    <Stack gap="xs" p="sm">
      {position.openTime && (
        <Group justify="space-between">
          <Text size="sm" fw={500}>
            {t("Open Time")}:
          </Text>
          <Text size="sm">{formatDateTime(position.openTime)}</Text>
        </Group>
      )}
      {position.closeTime && (
        <Group justify="space-between">
          <Text size="sm" fw={500}>
            {t("Close Time")}:
          </Text>
          <Text size="sm">{formatDateTime(position.closeTime)}</Text>
        </Group>
      )}
      <Divider />
      <Group justify="space-between">
        <Text size="sm" fw={500}>
          {t("Position ID")}:
        </Text>
        <Text size="sm">{position.externalId}</Text>
      </Group>
      <Group justify="space-between">
        <Text size="sm" fw={500}>
          {t("Active ID")}:
        </Text>
        <Text size="sm">{position.activeId}</Text>
      </Group>
    </Stack>
  );
}
