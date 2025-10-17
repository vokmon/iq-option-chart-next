import { useEffect, useState } from "react";
import { IconClock } from "@tabler/icons-react";
import { useAssetStore } from "@/stores/assets/assetStore";
import { getFirstAvailableInstrument } from "@/utils/tradingUtil";
import { formatSecondsToMMSS, formatTime } from "@/utils/dateTime";
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
      if (!activeAsset?.asset?.instruments) {
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

        const durationRemaining = firstInstrument.durationRemainingForPurchase(
          sdk.currentTime()
        );
        setDurationRemaining(durationRemaining);

        // Format duration as MM:SS
        const totalSeconds = Math.floor(durationRemaining / 1000);
        // Format purchaseEndTime
        const formattedDuration = formatSecondsToMMSS(
          Math.max(0, totalSeconds)
        );
        const formattedEndTime = formatTime(purchaseEndTimeDate);

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
  }, [activeAsset, sdk]);

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
    </div>
  );
}
