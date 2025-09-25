"use client";

import { Button } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useSdk } from "@/hooks/useSdk";

export default function LogoutButton() {
  const router = useRouter();
  const { sdk } = useSdk();

  const handleLogout = async () => {
    try {
      // Disconnect the SDK if it has a disconnect method
      if (sdk && "disconnect" in sdk) {
        (sdk as { disconnect: () => void }).disconnect();
      }

      // Call logout API route
      const response = await fetch("/api/v2/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Redirect to login page after successful logout
        router.push("/login");
      } else {
        console.error("Logout failed");
        // Still redirect to login even if API call fails
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect to login even if there's an error
      router.push("/login");
    }
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
