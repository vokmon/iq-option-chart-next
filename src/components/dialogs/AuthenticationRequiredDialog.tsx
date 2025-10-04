"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Modal, Button, Group, Text, Stack, ThemeIcon } from "@mantine/core";
import { IconShieldLock } from "@tabler/icons-react";
import { authService } from "../../services/authService";

interface AuthenticationRequiredDialogProps {
  isOpen: boolean;
}

export const AuthenticationRequiredDialog = ({
  isOpen,
}: AuthenticationRequiredDialogProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = useTranslations();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.performLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={() => {}} // Prevent closing - user must authenticate
      title={
        <Group gap="sm">
          <ThemeIcon color="blue" variant="light" size="lg">
            <IconShieldLock size={30} />
          </ThemeIcon>
          <Text size="lg" fw={500}>
            {t("Session Required")}
          </Text>
        </Group>
      }
      centered
      size="md"
      withCloseButton={false}
    >
      <Stack gap="md">
        <Text size="lg" c="dark" ta="center" style={{ whiteSpace: "pre-line" }}>
          {t("Authentication Required Message")}
        </Text>

        <Group justify="center">
          <Button
            onClick={handleLogout}
            loading={isLoggingOut}
            color="orange"
            size="md"
          >
            {t("Go to Login")}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
