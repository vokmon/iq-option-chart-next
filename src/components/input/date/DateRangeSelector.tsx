"use client";

import { useState } from "react";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { formatSelectedDates, isDateInRange } from "@/utils/dateTime";
import { Popover, Button, ActionIcon, Stack } from "@mantine/core";
import PresetSelector from "./PresetSelector";
import CustomCalendar from "./CustomCalendar";
import DateSummary from "./DateSummary";
import { useTranslations } from "next-intl";
import { PresetType } from "./type";

interface DateRangeSelectorProps {
  selectedDates: { dates: Date[]; preset: PresetType } | null;
  onDatesChange: (dates: { dates: Date[]; preset: PresetType }) => void;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
}

interface PresetOption {
  label: string;
  value: PresetType;
  getDates: () => Date[];
}

export default function DateRangeSelector({
  selectedDates,
  onDatesChange,
  className = "",
  minDate,
  maxDate,
}: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const presets = getPresets(selectedDates?.dates || [], minDate, maxDate);

  const handlePresetSelect = (preset: PresetOption) => {
    if (preset.value !== "custom") {
      onDatesChange({ dates: preset.getDates(), preset: preset.value });
      setIsOpen(false);
    } else {
      onDatesChange({ dates: selectedDates?.dates || [], preset: "custom" });
    }
    // For custom, keep the dropdown open
  };

  const handleApplyCustomDates = (dates: Date[]) => {
    onDatesChange({ dates: dates, preset: "custom" });
    setIsOpen(false);
  };

  const clearSelection = () => {
    onDatesChange({ dates: [], preset: "today" });
  };

  return (
    <Popover
      opened={isOpen}
      onChange={setIsOpen}
      position="bottom-start"
      withArrow
      shadow="md"
      radius="md"
    >
      <Popover.Target>
        <div className="relative">
          <Button
            variant="outline"
            color="blue"
            leftSection={<IconCalendar size={16} />}
            onClick={() => setIsOpen(!isOpen)}
            className={`min-w-50 text-gray-800 ${className}`}
          >
            {(() => {
              const displayText = formatSelectedDates(
                selectedDates?.dates || []
              );
              // Check if it's a translation key (not a date string)
              if (
                displayText === "Today" ||
                displayText === "Yesterday" ||
                displayText === "Select Date" ||
                displayText === "dates selected"
              ) {
                return t(displayText, {
                  daysCount: selectedDates?.dates.length || 0,
                });
              }
              // If it's a date string, return it directly
              return displayText;
            })()}
          </Button>
          {selectedDates?.dates && selectedDates?.dates.length > 0 && (
            <ActionIcon
              size="sm"
              variant="subtle"
              color="blue"
              onClick={(e) => {
                e.stopPropagation();
                clearSelection();
              }}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 10,
              }}
            >
              <IconX size={12} />
            </ActionIcon>
          )}
        </div>
      </Popover.Target>

      <Popover.Dropdown w={280}>
        <Stack gap="md">
          {/* Preset Options */}
          <PresetSelector
            presets={presets}
            selectedPreset={selectedDates?.preset || "today"}
            onPresetSelect={handlePresetSelect}
          />

          {/* Custom Date Picker */}
          {selectedDates?.preset === "custom" && (
            <CustomCalendar
              selectedDates={selectedDates?.dates || []}
              onApply={handleApplyCustomDates}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}

          {/* Selected Dates Summary */}
          <DateSummary
            selectedDates={selectedDates?.dates || []}
            onDateRemove={(index) => {
              const newDates =
                selectedDates?.dates.filter((_, i) => i !== index) || [];
              onDatesChange({ dates: newDates, preset: "custom" });
            }}
          />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

// Helper function to filter dates within range
const filterDatesInRange = (
  dates: Date[],
  minDate?: Date,
  maxDate?: Date
): Date[] => {
  return dates.filter((date) => isDateInRange(date, minDate, maxDate));
};

const getPresets = (
  selectedDates: Date[],
  minDate?: Date,
  maxDate?: Date
): PresetOption[] => {
  return [
    {
      label: "Today",
      value: "today",
      getDates: () => {
        const today = new Date();

        return isDateInRange(today, minDate, maxDate) ? [today] : [];
      },
    },
    {
      label: "Yesterday",
      value: "yesterday",
      getDates: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return isDateInRange(yesterday, minDate, maxDate) ? [yesterday] : [];
      },
    },
    {
      label: "This Week",
      value: "thisWeek",
      getDates: () => {
        const today = new Date();
        const start = new Date(today);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
        start.setDate(diff);

        const end = new Date(start);
        end.setDate(start.getDate() + 6); // Sunday

        const dates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        return filterDatesInRange(dates, minDate, maxDate);
      },
    },
    {
      label: "This Month",
      value: "thisMonth",
      getDates: () => {
        const today = new Date();
        const start = new Date(today.getFullYear(), today.getMonth(), 1);
        const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        const dates = [];
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d));
        }
        return filterDatesInRange(dates, minDate, maxDate);
      },
    },
    {
      label: "Custom",
      value: "custom",
      getDates: () => selectedDates,
    },
  ];
};
