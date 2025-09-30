import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import { Position } from "@quadcode-tech/client-sdk-js";
import { useTranslations } from "next-intl";
import Image from "next/image";

type SellPositionNotiticationProps = {
  position: Position;
};

export default function SellPositionNotitication({
  position,
}: SellPositionNotiticationProps) {
  const t = useTranslations();
  const asset = position.active;
  const { activeInformation } = useDigitalOptionsStore();
  const activeDataDetails = activeInformation[position?.activeId || 0];

  const message = `${t("Sell position successfully", {
    assetName: activeDataDetails?.name || asset?.name || "",
  })}`;

  return (
    <div className="flex flex-row justify-start items-center gap-2">
      {activeDataDetails?.imageUrl && (
        <div className="w-10 h-10 mr-4">
          <Image
            src={activeDataDetails?.imageUrl}
            alt={activeDataDetails?.name || ""}
            width={40}
            height={40}
          />
        </div>
      )}
      {message}
    </div>
  );
}
