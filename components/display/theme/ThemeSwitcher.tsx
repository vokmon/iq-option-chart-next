"use client";

import React from "react";
import { Select } from "@mantine/core";
import { useTheme } from "../../../context/ThemeContext";
import { getThemeList, ThemeName } from "../../../theme/themes";

export function ThemeSwitcher() {
  const { currentTheme, setTheme } = useTheme();
  const themeList = getThemeList();

  return (
    <Select
      placeholder="Select theme"
      value={currentTheme}
      onChange={(value) => {
        console.log("Theme change:", value);
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
