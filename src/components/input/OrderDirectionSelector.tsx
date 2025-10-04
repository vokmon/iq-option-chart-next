import React from "react";
import { Button, Group } from "@mantine/core";
import { useTranslations } from "next-intl";

interface OrderDirectionSelectorProps {
  onCall: () => void;
  onPut: () => void;
  disabled?: boolean;
  callLabel?: string;
  putLabel?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

export default function OrderDirectionSelector({
  onCall,
  onPut,
  disabled = false,
  callLabel,
  putLabel,
  size = "md",
  fullWidth = false,
}: OrderDirectionSelectorProps) {
  const t = useTranslations();

  return (
    <Group gap="xs" justify="center" grow={fullWidth}>
      <Button
        color="green"
        onClick={onCall}
        disabled={disabled}
        size={size}
        variant="filled"
        fullWidth={fullWidth}
        style={{ fontWeight: 600 }}
      >
        {callLabel || t("CALL")}
      </Button>
      <Button
        color="red"
        onClick={onPut}
        disabled={disabled}
        size={size}
        variant="filled"
        fullWidth={fullWidth}
        style={{ fontWeight: 600 }}
      >
        {putLabel || t("PUT")}
      </Button>
    </Group>
  );
}
