"use client";

import { useState, useMemo, useEffect } from "react";
import { Pagination, Group, Text } from "@mantine/core";
import ClosePositionCard from "./ClosePositionCard";
import OpenPositionCard from "./OpenPositionCard";
import { Active, Balance, Position } from "@quadcode-tech/client-sdk-js";

interface PositionsPanelProps {
  openPositions: Position[];
  closedPositions: Position[];
  activeInformation?: Record<number, Active>;
  balance?: Balance;
  onSellClick?: (position: Position) => void;
  itemsPerPage?: number;
}

type PositionWithType = Position & { type: "open" | "closed" };

const DEFAULT_ITEMS_PER_PAGE = 10;

export default function PositionsPanel({
  openPositions,
  closedPositions,
  activeInformation,
  balance,
  onSellClick,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
}: PositionsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Combine all positions for pagination
  const allPositions = useMemo((): PositionWithType[] => {
    const openPositionsWithType: PositionWithType[] = openPositions.map((pos) =>
      Object.assign(pos, { type: "open" as const })
    );
    const closedPositionsWithType: PositionWithType[] = closedPositions.map(
      (pos) => Object.assign(pos, { type: "closed" as const })
    );
    return [...openPositionsWithType, ...closedPositionsWithType];
  }, [openPositions, closedPositions]);

  // Calculate pagination
  const totalItems = allPositions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPositions = allPositions.slice(startIndex, endIndex);

  // Reset to first page when positions change
  useEffect(() => {
    setCurrentPage(1);
  }, [openPositions, closedPositions]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Positions List */}
      <div className="flex flex-col gap-1">
        {currentPositions.map((position) => {
          const activeInfo = activeInformation?.[position.activeId as number];

          if (position.type === "open") {
            return (
              <OpenPositionCard
                key={position.externalId}
                position={position}
                activeInfo={activeInfo}
                balance={balance}
                onSellClick={onSellClick}
              />
            );
          } else {
            return (
              <ClosePositionCard
                key={position.externalId}
                position={position}
                activeInfo={activeInfo}
                balance={balance}
              />
            );
          }
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col mt-2 justify-start items-center gap-2">
          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={handlePageChange}
            size="xs"
            radius="md"
            withEdges
            siblings={1}
          />
          <Text size="sm" c="dimmed">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} positions
          </Text>
        </div>
      )}
    </div>
  );
}
