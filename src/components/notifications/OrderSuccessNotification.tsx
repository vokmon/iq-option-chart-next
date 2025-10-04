import { useTranslations } from "next-intl";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import {
  DigitalOptionsDirection,
  DigitalOptionsUnderlying,
} from "@quadcode-tech/client-sdk-js";
import Image from "next/image";
import { Box } from "@mantine/core";
import { IconRobot } from "@tabler/icons-react";

export const OrderSuccessNotification = ({
  asset,
  direction,
  isSystemTrade,
}: {
  asset: DigitalOptionsUnderlying;
  direction: DigitalOptionsDirection;
  isSystemTrade?: boolean;
}) => {
  const t = useTranslations();
  const { activeInformation } = useDigitalOptionsStore();

  const activeDataDetails = activeInformation[asset?.activeId || 0];
  const directionText =
    direction === DigitalOptionsDirection.Call ? "Call 🔺" : "Put 🔻";

  const message = `${t("Order placed successfully", {
    direction: directionText,
    assetName: activeDataDetails?.name || asset?.name || "",
  })}`;

  return (
    <div className="flex flex-row justify-start items-center gap-2">
      {activeDataDetails?.imageUrl && (
        <div className="w-10 h-10 mr-4">
          <Image
            src={activeDataDetails?.imageUrl}
            alt={activeDataDetails?.name || ""}
            width={40}
            height={40}
          />
        </div>
      )}

      {message}

      {isSystemTrade && (
        <Box
          className="flex items-center justify-center w-6 h-6 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, var(--mantine-color-blue-1) 0%, var(--mantine-color-blue-2) 50%, var(--mantine-color-blue-3) 100%)",
            boxShadow: "0 2px 8px rgba(34, 139, 255, 0.15)",
          }}
        >
          <IconRobot
            size={14}
            style={{
              background:
                "linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          />
        </Box>
      )}
    </div>
  );
};
