"use client";

import { Modal } from "@mantine/core";
import OpenPositionTableController from "./OpenPositionTableController";
import ClosedPositionTableController from "./ClosedPositionTableController";
import { useTranslations } from "next-intl";

type PositionsDetailsModalProps = {
  opened: boolean;
  onClose: () => void;
};

export default function PositionsDetailsModal({
  opened,
  onClose,
}: PositionsDetailsModalProps) {
  const t = useTranslations();
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t("Trading Summary")}
      size="md"
      radius="lg"
      className="bg-gray-800 z-1000 relative"
    >
      <div className="h-full w-full relative overflow-y-auto ">
        <OpenPositionTableController />
        <ClosedPositionTableController />
      </div>
    </Modal>
  );
}
