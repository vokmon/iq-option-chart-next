"use client";

import { Group, Text } from "@mantine/core";
import { IconCalculatorFilled } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import MartingaleModal from "./MartingaleModal";
import { useTranslations } from "next-intl";

type MartingaleProps = {
  onClose?: () => void;
};

export default function Martingale({ onClose }: MartingaleProps) {
  const [opened, setOpened] = useState(false);
  const t = useTranslations();
  return (
    <>
      <Link href="" className="block" onClick={() => setOpened(true)}>
        <Group gap="sm" align="center">
          <IconCalculatorFilled
            size={16}
            className="text-gray-400 group-hover:text-white transition-all duration-300 ease-out"
          />
          <Text
            size="md"
            fw={500}
            className="!text-gray-200 group-hover:text-white transition-all duration-300 ease-out"
          >
            {t("Margingale")}
          </Text>
        </Group>
      </Link>
      <MartingaleModal
        opened={opened}
        onClose={() => {
          setOpened(false);
          onClose?.();
        }}
      />
    </>
  );
}
