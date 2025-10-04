import { useTranslations } from "next-intl";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";
import {
  DigitalOptionsDirection,
  DigitalOptionsUnderlying,
} from "@quadcode-tech/client-sdk-js";
import Image from "next/image";

export const OrderSuccessNotification = ({
  asset,
  direction,
}: {
  asset: DigitalOptionsUnderlying;
  direction: DigitalOptionsDirection;
}) => {
  const t = useTranslations();
  const { activeInformation } = useDigitalOptionsStore();

  const activeDataDetails = activeInformation[asset?.activeId || 0];
  const directionText =
    direction === DigitalOptionsDirection.Call ? "Call 🔺" : "Put 🔻";

  const message = `${t("Order placed successfully", {
    direction: directionText,
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
};
