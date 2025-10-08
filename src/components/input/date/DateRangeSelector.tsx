"use client";

import { useState, useEffect } from "react";
import { IconCalendar, IconX } from "@tabler/icons-react";
import { formatSelectedDates } from "@/utils/dateTime";
import { Popover, Button, ActionIcon, Stack } from "@mantine/core";
import PresetSelector from "./PresetSelector";
import CustomCalendar from "./CustomCalendar";
import DateSummary from "./DateSummary";
import { useTranslations } from "next-intl";

interface DateRangeSelectorProps {
  selectedDates: Date[];
  onDatesChange: (dates: Date[]) => void;
  className?: string;
}

interface PresetOption {
  label: string;
  value: string;
  getDates: () => Date[];
}

export default function DateRangeSelector({
  selectedDates,
  onDatesChange,
  className = "",
}: DateRangeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("today");
  const t = useTranslations();
  const presets = getPresets(selectedDates);

  // Sync selectedPreset with actual selected dates
  useEffect(() => {
    if (selectedDates.length === 0) {
      setSelectedPreset("today");
      return;
    }

    // Check if current dates match any preset
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Normalize dates for comparison (remove time)
    const normalizeDate = (date: Date) => {
      const normalized = new Date(date);
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    const normalizedSelected = selectedDates.map(normalizeDate);
    const normalizedToday = normalizeDate(today);
    const normalizedYesterday = normalizeDate(yesterday);

    if (normalizedSelected.length === 1) {
      if (normalizedSelected[0].getTime() === normalizedToday.getTime()) {
        setSelectedPreset("today");
      } else if (
        normalizedSelected[0].getTime() === normalizedYesterday.getTime()
      ) {
        setSelectedPreset("yesterday");
      } else {
        setSelectedPreset("custom");
      }
    } else if (normalizedSelected.length > 1) {
      // Check if it's this week or this month
      const isThisWeek = checkIfThisWeek(normalizedSelected);
      const isThisMonth = checkIfThisMonth(normalizedSelected);

      if (isThisWeek) {
        setSelectedPreset("thisWeek");
      } else if (isThisMonth) {
        setSelectedPreset("thisMonth");
      } else {
        setSelectedPreset("custom");
      }
    }
  }, [selectedDates]);

  const handlePresetSelect = (preset: PresetOption) => {
    setSelectedPreset(preset.value);
    if (preset.value !== "custom") {
      onDatesChange(preset.getDates());
      setIsOpen(false);
    }
    // For custom, keep the dropdown open
  };

  const handleDateClick = (date: Date) => {
    onDatesChange([date]);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onDatesChange([]);
    setSelectedPreset("today");
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
              const displayText = formatSelectedDates(selectedDates);
              // Check if it's a translation key (not a date string)
              if (
                displayText === "Today" ||
                displayText === "Yesterday" ||
                displayText === "Select Date" ||
                displayText === "dates selected"
              ) {
                return t(displayText, {
                  daysCount: selectedDates.length,
                });
              }
              // If it's a date string, return it directly
              return displayText;
            })()}
          </Button>
          {selectedDates.length > 0 && (
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
            selectedPreset={selectedPreset}
            onPresetSelect={handlePresetSelect}
          />

          {/* Custom Date Picker */}
          {selectedPreset === "custom" && (
            <CustomCalendar
              selectedDates={selectedDates}
              onDateClick={handleDateClick}
            />
          )}

          {/* Selected Dates Summary */}
          <DateSummary
            selectedDates={selectedDates}
            onDateRemove={(index) => {
              const newDates = selectedDates.filter((_, i) => i !== index);
              onDatesChange(newDates);
            }}
          />
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

// Helper functions to check if dates match preset patterns
const checkIfThisWeek = (dates: Date[]): boolean => {
  const today = new Date();
  const start = new Date(today);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Sunday
  end.setHours(23, 59, 59, 999);

  const expectedDates: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    expectedDates.push(new Date(d));
  }

  if (dates.length !== expectedDates.length) return false;

  return dates.every((date) =>
    expectedDates.some((expected) => expected.getTime() === date.getTime())
  );
};

const checkIfThisMonth = (dates: Date[]): boolean => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const expectedDates: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    expectedDates.push(new Date(d));
  }

  if (dates.length !== expectedDates.length) return false;

  return dates.every((date) =>
    expectedDates.some((expected) => expected.getTime() === date.getTime())
  );
};

const getPresets = (selectedDates: Date[]): PresetOption[] => {
  return [
    {
      label: "Today",
      value: "today",
      getDates: () => [new Date()],
    },
    {
      label: "Yesterday",
      value: "yesterday",
      getDates: () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return [yesterday];
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
        return dates;
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
        return dates;
      },
    },
    {
      label: "Custom",
      value: "custom",
      getDates: () => selectedDates,
    },
  ];
};
