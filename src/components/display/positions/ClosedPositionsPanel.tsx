"use client";

import { useState, useEffect } from "react";
import { Pagination, Text } from "@mantine/core";
import ClosePositionCard from "./elements/ClosePositionCard";
import { Active, Balance, Position } from "@quadcode-tech/client-sdk-js";
import { EmptyClosedPositions } from "./EmptyClosedPositions";

interface ClosedPositionsPanelProps {
  closedPositions: Position[];
  activeInformation?: Record<number, Active>;
  balance?: Balance;
  itemsPerPage?: number;
  cardClassName?: string;
  textColor?: string;
}

const DEFAULT_ITEMS_PER_PAGE = 10;

export default function ClosedPositionsPanel({
  closedPositions,
  activeInformation,
  balance,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  cardClassName,
  textColor,
}: ClosedPositionsPanelProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to first page when positions change
  useEffect(() => {
    setCurrentPage(1);
  }, [closedPositions]);

  // Calculate pagination
  const totalItems = closedPositions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPositions = closedPositions.slice(startIndex, endIndex);

  if (closedPositions.length === 0) {
    return (
      <div className="flex flex-grow h-full">
        <EmptyClosedPositions />
      </div>
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Positions List */}
      <div className="flex flex-col gap-1">
        {currentPositions.map((position) => {
          const activeInfo = activeInformation?.[position.activeId as number];
          return (
            <ClosePositionCard
              key={position.externalId}
              position={position}
              activeInfo={activeInfo}
              balance={balance}
              className={cardClassName}
              textColor={textColor}
            />
          );
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
