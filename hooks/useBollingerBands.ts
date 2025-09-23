import { useState } from "react";
import { type BollingerBandsConfig } from "../utils/bollingerBands";

export interface UseBollingerBandsReturn {
  showBollingerBands: boolean;
  setShowBollingerBands: (show: boolean) => void;
  bollingerConfig: BollingerBandsConfig;
  setBollingerConfig: (config: BollingerBandsConfig) => void;
  updatePeriod: (period: number) => void;
  updateStdDev: (stdDev: number) => void;
}

export function useBollingerBands(
  initialConfig: BollingerBandsConfig = { period: 14, stdDev: 2 },
  initialShow: boolean = true
): UseBollingerBandsReturn {
  const [showBollingerBands, setShowBollingerBands] = useState(initialShow);
  const [bollingerConfig, setBollingerConfig] =
    useState<BollingerBandsConfig>(initialConfig);

  const updatePeriod = (period: number) => {
    setBollingerConfig((prev) => ({
      ...prev,
      period: typeof period === "number" ? period : 20,
    }));
  };

  const updateStdDev = (stdDev: number) => {
    setBollingerConfig((prev) => ({
      ...prev,
      stdDev: typeof stdDev === "number" ? stdDev : 2,
    }));
  };

  return {
    showBollingerBands,
    setShowBollingerBands,
    bollingerConfig,
    setBollingerConfig,
    updatePeriod,
    updateStdDev,
  };
}
