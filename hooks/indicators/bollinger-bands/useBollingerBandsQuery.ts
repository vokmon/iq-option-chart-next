import { useQueryState, parseAsBoolean, parseAsInteger } from "nuqs";
import { type BollingerBandsConfig } from "@/utils/indicators/bollingerBands";

export interface UseBollingerBandsQueryReturn {
  showBollingerBands: boolean;
  setShowBollingerBands: (show: boolean) => void;
  bollingerConfig: BollingerBandsConfig;
  updatePeriod: (period: number) => void;
  updateStdDev: (stdDev: number) => void;
}

export function useBollingerBandsQuery(
  defaultConfig: BollingerBandsConfig = { period: 14, stdDev: 2 },
  defaultShow: boolean = true
): UseBollingerBandsQueryReturn {
  const [showBollingerBands, setShowBollingerBands] = useQueryState(
    "showBollingerBands",
    parseAsBoolean.withDefault(defaultShow)
  );

  const [period, setPeriod] = useQueryState(
    "bollingerPeriod",
    parseAsInteger.withDefault(defaultConfig.period)
  );

  const [stdDev, setStdDev] = useQueryState(
    "bollingerStdDev",
    parseAsInteger.withDefault(defaultConfig.stdDev)
  );

  const bollingerConfig: BollingerBandsConfig = {
    period,
    stdDev,
  };

  const updatePeriod = (newPeriod: number) => {
    setPeriod(newPeriod);
  };

  const updateStdDev = (newStdDev: number) => {
    setStdDev(newStdDev);
  };

  return {
    showBollingerBands,
    setShowBollingerBands,
    bollingerConfig,
    updatePeriod,
    updateStdDev,
  };
}
