import { useState } from "react";
import { type DonchianConfig } from "../utils/donchian";

export interface UseDonchianReturn {
  showDonchian: boolean;
  setShowDonchian: (show: boolean) => void;
  donchianConfig: DonchianConfig;
  setDonchianConfig: (config: DonchianConfig) => void;
  updateDonchianPeriod: (period: number) => void;
}

export function useDonchian(
  initialConfig: DonchianConfig = { period: 20 },
  initialShow: boolean = true
): UseDonchianReturn {
  const [showDonchian, setShowDonchian] = useState(initialShow);
  const [donchianConfig, setDonchianConfig] =
    useState<DonchianConfig>(initialConfig);

  const updateDonchianPeriod = (period: number) => {
    setDonchianConfig((prev) => ({
      ...prev,
      period: typeof period === "number" ? period : 20,
    }));
  };

  return {
    showDonchian,
    setShowDonchian,
    donchianConfig,
    setDonchianConfig,
    updateDonchianPeriod,
  };
}
