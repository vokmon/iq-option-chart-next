"use client";

import { Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { authService } from "@/services/authService";

export default function LogoutButton() {
  const handleLogout = async () => {
    await authService.performLogout();
  };

  return (
    <Button
      variant="subtle"
      color="red"
      leftSection={<IconLogout size={16} />}
      onClick={handleLogout}
      w="100%"
    >
      Logout
    </Button>
  );
}
