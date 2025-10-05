import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { Position, Balance } from "@quadcode-tech/client-sdk-js";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { formatAmount } from "@/utils/currency";
import {
  IconCheck,
  IconX,
  IconMinus,
  IconTrendingUp,
  IconTrendingDown,
} from "@tabler/icons-react";
import { Badge, Text } from "@mantine/core";

export const PositionClosedNotification = ({
  position,
  balance,
}: {
  position: Position;
  balance?: Balance;
}) => {
  const t = useTranslations();
  const asset = position.active;
  const { activeInformation } = useDigitalOptionsStore();
  const activeDataDetails = activeInformation[position?.activeId || 0];

  const assetName = activeDataDetails?.name || asset?.name || "";
  const pnl = position.pnl ?? 0;
  const direction = position.direction?.toUpperCase() || "";

  // Determine result status
  const isWin = pnl > 0;
  const isLoss = pnl < 0;
  const isEven = pnl === 0;

  const resultText = isWin ? t("Win") : isLoss ? t("Loss") : t("Even");
  const resultColor = isWin ? "green" : isLoss ? "red" : "gray";

  return (
    <div className="flex flex-row justify-start items-center gap-2">
      {activeDataDetails?.imageUrl && (
        <div className="w-6 h-6">
          <Image
            src={activeDataDetails?.imageUrl}
            alt={activeDataDetails?.name || ""}
            width={24}
            height={24}
          />
        </div>
      )}
      <div className="flex flex-row items-center gap-2">
        <span className="text-md">
          {assetName}{" "}
          <Badge
            color={direction === "CALL" ? "green" : "red"}
            variant="light"
            size="md"
            style={{ textTransform: "none" }}
          >
            <div className="flex flex-row items-center gap-1">
              {direction === "CALL" ? (
                <IconTrendingUp size={12} />
              ) : (
                <IconTrendingDown size={12} />
              )}
              {direction}
            </div>
          </Badge>{" "}
          <Badge
            color={isWin ? "green" : isLoss ? "red" : "gray"}
            variant="light"
            size="md"
            style={{ textTransform: "none" }}
          >
            <div className="flex flex-row items-center gap-1">
              {isWin && <IconCheck size={12} />}
              {isLoss && <IconX size={12} />}
              {isEven && <IconMinus size={12} />}
              {resultText}
            </div>
          </Badge>{" "}
          <Text size="lg" fw={600} c={resultColor}>
            {isWin ? "+" : isLoss ? "" : ""}
            {formatAmount(
              isWin
                ? position.closeProfit ?? pnl + (position.invest || 0)
                : pnl,
              balance?.currency
            )}
          </Text>
        </span>
      </div>
    </div>
  );
};
