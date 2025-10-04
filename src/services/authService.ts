import { useSdkStore } from "../stores/sdkStore";

export const authService = {
  async logout(): Promise<void> {
    const response = await fetch("/api/v2/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Logout failed: ${response.status} ${response.statusText}`
      );
    }
  },

  async performLogout(): Promise<void> {
    // Get current state from stores
    const sdk = useSdkStore.getState().sdk;

    // 1. Shutdown the SDK
    sdk?.shutdown();

    try {
      // 2. Call logout API
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
      // Continue with logout even if API call fails
    } finally {
      // 3. Redirect to login page
      window.location.href = "/login";
    }
  },
};
