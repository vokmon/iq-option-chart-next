"use client";

import React from "react";
import { Select } from "@mantine/core";
import { useThemeStore } from "../../../stores/themeStore";
import { getThemeList, ThemeName } from "../../../theme/themes";

export function ThemeSwitcher() {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const themeList = getThemeList();

  return (
    <Select
      placeholder="Select theme"
      value={currentTheme}
      onChange={(value) => {
        if (value) {
          setTheme(value as ThemeName);
        }
      }}
      data={themeList.map((theme) => ({
        value: theme.key,
        label: theme.name,
      }))}
      size="sm"
      w="100%"
      comboboxProps={{
        withinPortal: false,
      }}
    />
  );
}
