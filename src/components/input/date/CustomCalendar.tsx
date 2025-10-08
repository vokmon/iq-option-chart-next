"use client";

import { useState } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { checkSameDay } from "@/utils/dateTime";
import { useTranslations } from "next-intl";
import {
  ActionIcon,
  Text,
  Group,
  Paper,
  SimpleGrid,
  Center,
  Button,
  Stack,
} from "@mantine/core";

interface CustomCalendarProps {
  selectedDates: Date[];
  onDateClick: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function CustomCalendar({
  selectedDates,
  onDateClick,
  minDate,
  maxDate,
}: CustomCalendarProps) {
  const t = useTranslations();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      if (direction === "prev") {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return checkSameDay(date, today);
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some((d) => checkSameDay(d, date));
  };

  const isDateInRange = (date: Date): boolean => {
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500} className="text-gray-800">
        {t("Select Date")}
      </Text>

      {/* Calendar Header */}
      <Group justify="space-between" mb="xs">
        <ActionIcon
          variant="subtle"
          color="blue"
          size="md"
          onClick={() => navigateMonth("prev")}
          disabled={
            minDate &&
            currentMonth.getMonth() <= minDate.getMonth() &&
            currentMonth.getFullYear() <= minDate.getFullYear()
          }
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        <Text size="sm" fw={500} className="text-gray-800">
          {currentMonth.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
          })}
        </Text>
        <ActionIcon
          variant="subtle"
          color="blue"
          size="md"
          onClick={() => navigateMonth("next")}
          disabled={
            maxDate &&
            currentMonth.getMonth() >= maxDate.getMonth() &&
            currentMonth.getFullYear() >= maxDate.getFullYear()
          }
        >
          <IconChevronRight size={18} />
        </ActionIcon>
      </Group>

      {/* Calendar Grid */}
      <Paper p="xs" withBorder>
        {/* Day Headers */}
        <SimpleGrid cols={7} spacing="xs" mb="xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Center key={day}>
              <Text size="xs" fw={500} className="text-gray-800">
                {t(day)}
              </Text>
            </Center>
          ))}
        </SimpleGrid>

        {/* Calendar Days */}
        <SimpleGrid cols={7} spacing="xs">
          {getDaysInMonth(currentMonth).map((date, index) => (
            <Center key={index}>
              {date ? (
                <Button
                  variant={isDateSelected(date) ? "filled" : "subtle"}
                  color={isDateSelected(date) ? "blue" : "gray"}
                  size="xs"
                  onClick={() => onDateClick(date)}
                  disabled={!isDateInRange(date)}
                  className={
                    isDateSelected(date) ? "text-white" : "text-gray-800"
                  }
                  style={{
                    width: 32,
                    height: 32,
                    padding: 0,
                    fontSize: 12,
                    fontWeight: isToday(date) ? 700 : 400,
                    color: isDateSelected(date)
                      ? "white"
                      : isDateInRange(date)
                      ? "#1f2937"
                      : "#9ca3af",
                    border:
                      isToday(date) && !isDateSelected(date)
                        ? "1px solid var(--mantine-color-blue-5)"
                        : "none",
                    opacity: isDateInRange(date) ? 1 : 0.5,
                  }}
                >
                  {date.getDate()}
                </Button>
              ) : (
                <div style={{ width: 32, height: 32 }} />
              )}
            </Center>
          ))}
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
