import { Select } from "@mantine/core";
import { useTranslations } from "next-intl";
import { useCandleSize } from "../../hooks/chart/useCandleSize";
import { useAssetSelection } from "../../hooks/chart/useAssetSelection";
import { IconClock } from "@tabler/icons-react";

const candleSizes = [60, 300];

export default function CandleSizeSelector() {
  const t = useTranslations();
  const { currentCandleSize, handleCandleSizeChange } = useCandleSize();
  const { activeAssetId } = useAssetSelection();
  return (
    <Select
      key={`candle-${activeAssetId}`} // Force re-render when active asset changes
      label={t("Candle Size")}
      placeholder={t("Choose candle size")}
      value={currentCandleSize}
      onChange={handleCandleSizeChange}
      data={candleSizes.map((s) => ({
        value: String(s),
        label: `${s / 60} min`,
      }))}
      leftSectionWidth={40}
      leftSection={
        <div
          style={{
            background: "linear-gradient(45deg, #2c3e50, #34495e)",
            borderRadius: "50%",
            padding: "0px",
            marginRight: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <IconClock color="white" />
        </div>
      }
      classNames={{
        label: "text-white/90",
      }}
    />
  );
}
