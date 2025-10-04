import { Accordion, Text, Badge } from "@mantine/core";
import { Active, Balance, Position } from "@quadcode-tech/client-sdk-js";
import { IconCheck, IconX, IconMinus } from "@tabler/icons-react";
import { formatAmount } from "@/utils/currency";
import { useTranslations } from "next-intl";
import Image from "next/image";
import PositionDetails from "./PositionDetails";

interface ClosePositionCardProps {
  position: Position;
  activeInfo?: Active;
  balance?: Balance;
}

export default function ClosePositionCard({
  position,
  activeInfo,
  balance,
}: ClosePositionCardProps) {
  const t = useTranslations();

  const renderPositionSummary = (position: Position, activeInfo?: Active) => (
    <div className="flex flex-col justify-center items-start w-full gap-1">
      <div className="flex flex-row justify-between items-center gap-2 w-full">
        <div className="flex flex-row justify-start items-center gap-2">
          <div className="w-6 h-6">
            {activeInfo?.imageUrl && (
              <Image
                src={activeInfo?.imageUrl || ""}
                alt={activeInfo?.name || ""}
                width={30}
                height={30}
              />
            )}
          </div>
          <Text size="sm" fw={500}>
            {activeInfo?.name || position.active?.name}
          </Text>
        </div>

        <div className="flex flex-row justify-start items-center gap-2 no-wrap">
          <Badge
            color={position.direction === "call" ? "green" : "red"}
            variant="light"
            size="sm"
            w="50px"
            style={{ textTransform: "none" }}
          >
            <div className="flex flex-row justify-start items-center gap-2">
              {/* {position.direction === "call" ? (
                <IconTrendingUp size={20} color="green" />
              ) : (
                <IconTrendingDown size={20} color="red" />
              )} */}
              {position.direction?.toUpperCase()}
            </div>
          </Badge>

          <Text size="sm" fw={600}>
            {formatAmount(position.invest || 0, balance?.currency, {
              noDecimals: true,
            })}
          </Text>
        </div>
      </div>

      <div className="flex flex-row justify-start items-center gap-2">
        <Badge
          size="md"
          color={
            position.pnl === 0
              ? "gray"
              : (position.pnl ?? 0) > 0
              ? "green"
              : "red"
          }
          w="80px"
          variant="light"
          style={{ textTransform: "none" }}
        >
          <div className="flex flex-row justify-start items-center gap-1">
            {(position?.pnl ?? 0) > 0 ? (
              <IconCheck size={16} color="green" />
            ) : (position?.pnl ?? 0) < 0 ? (
              <IconX size={16} color="red" />
            ) : (
              <IconMinus size={16} color="gray" />
            )}
            {(position?.pnl ?? 0) > 0
              ? t("Win")
              : (position?.pnl ?? 0) < 0
              ? t("Loss")
              : t("Even")}
          </div>
        </Badge>
        <Text
          size="lg"
          fw={600}
          c={
            position.pnl === 0
              ? "black"
              : (position.pnl ?? 0) > 0
              ? "green"
              : "red"
          }
        >
          {formatAmount(
            (position?.pnl ?? 0) > 0
              ? position.closeProfit ?? 0
              : position.pnl ?? 0,
            balance?.currency
          )}
        </Text>
      </div>
    </div>
  );

  return (
    <Accordion
      variant="contained"
      chevronPosition="right"
      key={position.externalId}
    >
      <Accordion.Item value={String(position.externalId)}>
        <Accordion.Control>
          {renderPositionSummary(position, activeInfo)}
        </Accordion.Control>
        <Accordion.Panel>
          <PositionDetails position={position} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
