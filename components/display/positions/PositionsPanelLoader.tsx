import { Box, Skeleton } from "@mantine/core";

// Skeleton component for individual position cards
const PositionCardSkeleton = () => (
  <Box className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
    <div className="flex flex-col justify-center items-start w-full gap-1">
      <div className="flex flex-row justify-between items-center gap-2 w-full">
        <div className="flex flex-row justify-start items-center gap-2">
          <Skeleton height={24} width={24} radius="sm" />
          <div className="flex flex-col gap-1">
            <Skeleton height={16} width={80} radius="sm" />
            <Skeleton height={12} width={60} radius="sm" />
          </div>
        </div>
        <div className="flex flex-row justify-end items-center gap-2">
          <Skeleton height={20} width={60} radius="sm" />
          <Skeleton height={24} width={24} radius="sm" />
        </div>
      </div>
      <div className="flex flex-row justify-between items-center gap-2 w-full">
        <div className="flex flex-row justify-start items-center gap-2">
          <Skeleton height={16} width={40} radius="sm" />
          <Skeleton height={16} width={30} radius="sm" />
        </div>
        <div className="flex flex-row justify-end items-center gap-2">
          <Skeleton height={16} width={50} radius="sm" />
          <Skeleton height={16} width={40} radius="sm" />
        </div>
      </div>
    </div>
  </Box>
);

export default function PositionsPanelLoader() {
  return (
    <Box className="flex flex-col gap-1 w-full">
      {/* Skeleton position cards */}
      <div className="flex flex-col gap-1 mt-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <PositionCardSkeleton key={index} />
        ))}
      </div>

      {/* Skeleton pagination */}
      <div className="flex flex-col mt-2 justify-start items-center gap-2">
        <div className="flex flex-row gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} height={32} width={32} radius="md" />
          ))}
        </div>
        <Skeleton height={16} width={120} radius="sm" />
      </div>
    </Box>
  );
}
