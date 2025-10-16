import { Card, Skeleton, Group, Badge, ActionIcon } from "@mantine/core";
import { IconChartArea } from "@tabler/icons-react";

export default function TraderSummaryLoader() {
  return (
    <Card
      shadow="xs"
      padding="6px"
      radius="sm"
      className="bg-gradient-to-r from-slate-50 to-blue-50 hover:shadow-sm transition-all duration-200 w-full"
      style={{
        border: "1px solid rgba(100, 116, 139, 0.15)",
        boxShadow:
          "0 0 12px rgba(100, 116, 139, 0.08), inset 0 0 12px rgba(100, 116, 139, 0.03)",
      }}
    >
      <div className="flex flex-col justify-center items-start gap-0 w-full">
        <div className="flex flex-row justify-center items-center gap-2 w-full">
          <Group gap="xs" align="center">
            <ActionIcon
              size="sm"
              radius="sm"
              variant="light"
              color="gray"
              className="flex-shrink-0"
            >
              <IconChartArea size={14} />
            </ActionIcon>
            <div className="flex flex-col">
              <Skeleton height={20} width={80} radius="sm" />
            </div>
          </Group>
        </div>

        {/* Progress bar loader */}
        <div className="w-full px-1 py-1">
          <div className="flex flex-row justify-between items-center w-full mt-1">
            <Skeleton height={12} width={60} radius="sm" />
            <Skeleton height={12} width={60} radius="sm" />
          </div>
          <div className="relative w-full h-5 bg-gray-200 rounded-sm overflow-hidden mt-1">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-400 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <Badge size="sm" variant="filled" color="gray" className="px-2">
                <Skeleton height={12} width={30} radius="sm" />
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between items-center gap-2 w-full">
          <Badge size="sm" variant="light" color="green" className="px-2 py-1">
            <div className="flex flex-row justify-start items-center gap-2">
              <Skeleton height={12} width={24} radius="sm" />
              <Skeleton height={12} width={12} radius="sm" />
            </div>
          </Badge>
          <Badge size="sm" variant="light" color="red" className="px-2 py-1">
            <div className="flex flex-row justify-start items-center gap-2">
              <Skeleton height={12} width={32} radius="sm" />
              <Skeleton height={12} width={12} radius="sm" />
            </div>
          </Badge>
          <Badge size="sm" variant="light" color="gray" className="px-2 py-1">
            <div className="flex flex-row justify-start items-center gap-2">
              <Skeleton height={12} width={40} radius="sm" />
              <Skeleton height={12} width={20} radius="sm" />
            </div>
          </Badge>
        </div>
      </div>
    </Card>
  );
}
