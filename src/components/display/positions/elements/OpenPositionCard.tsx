import { Accordion, Text, Badge, Indicator } from "@mantine/core";
import { Active, Balance, Position } from "@quadcode-tech/client-sdk-js";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconCash,
} from "@tabler/icons-react";
import { formatAmount } from "@/utils/currency";
import Image from "next/image";
import PositionDetails from "./PositionDetails";
import CountdownTimer from "./CountdownTimer";

interface OpenPositionCardProps {
  position: Position;
  activeInfo?: Active;
  balance?: Balance;
  onSellClick?: (position: Position) => void;
  className?: string;
  textColor?: string;
}

export default function OpenPositionCard({
  position,
  activeInfo,
  balance,
  onSellClick,
  className,
  textColor,
}: OpenPositionCardProps) {
  const renderPositionSummary = (position: Position, activeInfo?: Active) => (
    <div className="flex flex-col justify-center items-start w-full gap-1">
      <div className="flex flex-row justify-between items-center gap-2 w-full">
        <Indicator inline processing color="orange" offset={-2} size={12}>
          <div className="flex flex-row justify-start items-center gap-2">
            <div className="w-5 h-5">
              {activeInfo?.imageUrl && (
                <Image
                  src={activeInfo?.imageUrl || ""}
                  alt={activeInfo?.name || ""}
                  width={30}
                  height={30}
                />
              )}
            </div>
            <Text size="xs" fw={500} c={textColor}>
              {activeInfo?.name || position.active?.name}
            </Text>
          </div>
        </Indicator>
        <div className="flex flex-row justify-start items-center gap-2">
          {position.expirationTime && (
            <CountdownTimer endTime={position.expirationTime} />
          )}
        </div>
      </div>
      <div className="flex flex-row justify-start items-center gap-2">
        <Badge
          color={position.direction === "call" ? "green" : "red"}
          variant="light"
          size="sm"
          w="80px"
          style={{ textTransform: "none" }}
        >
          <div className="flex flex-row justify-start items-center gap-2">
            {position.direction === "call" ? (
              <IconTrendingUp size={20} color="green" />
            ) : (
              <IconTrendingDown size={20} color="red" />
            )}
            {position.direction?.toUpperCase()}
          </div>
        </Badge>

        <Text size="xs" fw={600}>
          {formatAmount(position.invest || 0, balance?.currency)}
        </Text>
      </div>

      <div className="flex justify-between items-center gap-2 w-full">
        <Text
          size="md"
          fw={600}
          c={
            position.pnl === 0
              ? "black"
              : (position.pnl ?? 0) > 0
              ? "green"
              : "red"
          }
        >
          {formatAmount(position?.pnl ?? 0, balance?.currency)}
        </Text>
        <div
          className="flex items-center gap-1 px-3 py-2 mr-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 hover:scale-105 hover:shadow-md rounded cursor-pointer transition-all duration-200 ease-in-out active:scale-95 active:bg-red-200"
          onClick={() => {
            onSellClick?.(position);
          }}
        >
          <IconCash
            size={14}
            className="transition-transform duration-200 hover:rotate-12"
          />
          Sell
        </div>
      </div>
    </div>
  );

  return (
    <Accordion
      variant="contained"
      chevronPosition="right"
      key={position.externalId}
      className={`${className} bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200`}
      p={0}
    >
      <Accordion.Item
        value={String(position.externalId)}
        className="border-none"
      >
        <Accordion.Control
          py={0}
          className="bg-transparent hover:bg-blue-100/50 transition-colors duration-200"
        >
          {renderPositionSummary(position, activeInfo)}
        </Accordion.Control>
        <Accordion.Panel className="backdrop-blur-sm">
          <PositionDetails position={position} />
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
