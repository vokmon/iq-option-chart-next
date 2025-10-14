import { Card, Skeleton, Group, Badge } from "@mantine/core";
import { IconChartArea } from "@tabler/icons-react";

export default function TraderSummaryLoader() {
  return (
    <Card
      shadow="xs"
      padding="6px"
      radius="sm"
      className="bg-gradient-to-r from-slate-50 to-blue-50 hover:shadow-sm transition-all duration-200 w-full"
      style={{
        height: "60px",
        border: "1px solid rgba(100, 116, 139, 0.15)",
        boxShadow:
          "0 0 12px rgba(100, 116, 139, 0.08), inset 0 0 12px rgba(100, 116, 139, 0.03)",
      }}
    >
      <div className="flex flex-col justify-center items-start gap-0 w-full">
        <div className="flex flex-row justify-center items-center gap-2 w-full">
          <Group gap="xs" align="center">
            <div className="w-6 h-6 rounded-sm bg-slate-200 animate-pulse flex items-center justify-center">
              <IconChartArea size={14} className="text-slate-400" />
            </div>
            <div className="flex flex-col">
              <Skeleton height={20} width={80} radius="sm" />
            </div>
          </Group>
        </div>
        <div className="flex flex-row justify-between items-center gap-2 w-full">
          <Badge size="sm" variant="light" color="gray" className="px-2 py-1">
            <div className="flex flex-row justify-start items-center gap-2">
              <Skeleton height={12} width={24} radius="sm" />
              <Skeleton height={12} width={12} radius="sm" />
            </div>
          </Badge>
          <Badge size="sm" variant="light" color="gray" className="px-2 py-1">
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
