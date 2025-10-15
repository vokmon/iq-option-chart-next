import { useEffect, useState } from "react";
import { IconClock } from "@tabler/icons-react";
import { useAssetStore } from "@/stores/assetStore";
import { getFirstAvailableInstrument } from "@/utils/tradingUtil";
import { formatTime } from "@/utils/dateTime";
import { useSdk } from "@/hooks/useSdk";

interface PurchaseEndTimeData {
  formattedDuration: string;
  formattedEndTime: string;
}

export function PurchaseEndTimeOverlay() {
  const { getActiveAsset } = useAssetStore();
  const [data, setData] = useState<PurchaseEndTimeData | null>(null);
  const [durationRemaining, setDurationRemaining] = useState<number>(0);
  const activeAsset = getActiveAsset();
  const { sdk } = useSdk();

  useEffect(() => {
    const updateData = async () => {
      if (!activeAsset?.asset) {
        setData(null);
        return;
      }

      try {
        const instruments = await activeAsset.asset.instruments();
        const firstInstrument = getFirstAvailableInstrument(
          instruments,
          activeAsset.candleSize,
          sdk.currentTime()
        );

        if (!firstInstrument) {
          setData(null);
          return;
        }

        const purchaseEndTimeDate = firstInstrument.purchaseEndTime();
        const purchaseEndTime =
          purchaseEndTimeDate instanceof Date
            ? Math.floor(purchaseEndTimeDate.getTime() / 1000)
            : purchaseEndTimeDate;
        const durationRemaining = firstInstrument.durationRemainingForPurchase(
          new Date()
        );

        setDurationRemaining(durationRemaining);

        // Format duration as MM:SS
        const totalSeconds = Math.floor(durationRemaining / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const formattedDuration = `${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

        // Format purchaseEndTime
        const endTimeDate = new Date(purchaseEndTime * 1000);
        const formattedEndTime = formatTime(endTimeDate);

        setData({ formattedDuration, formattedEndTime });
      } catch (error) {
        console.warn("Error updating purchase end time indicator:", error);
        setData(null);
      }
    };

    // Initial update
    updateData();

    // Update every second
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, [activeAsset]);

  if (!data) return null;

  return (
    <div className="absolute flex items-center justify-center -top-5.5 right-[10px] px-3 py-2 bg-blue-900/90 text-white rounded-lg text-[13px] font-semibold shadow-md z-[10] pointer-events-none flex items-center gap-2">
      <div className="flex flex-row items-center gap-2 justify-center">
        <IconClock className="w-4 h-4" />
        <div className="font-bold">Purchase Time</div>
      </div>
      <div
        className={`font-bold text-[15px] ${
          durationRemaining <= 10 * 1000 ? "animate-bounce duration-1000" : ""
        }`}
      >
        {data.formattedDuration}
      </div>
      <span className="opacity-80">|</span>
      <span className="text-xs">{data.formattedEndTime}</span>
    </div>
  );
}
