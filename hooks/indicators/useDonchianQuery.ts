import { useQueryState, parseAsBoolean, parseAsInteger } from "nuqs";
import { type DonchianConfig } from "@/utils/donchian";

export interface UseDonchianQueryReturn {
  showDonchian: boolean;
  setShowDonchian: (show: boolean) => void;
  donchianConfig: DonchianConfig;
  updateDonchianPeriod: (period: number) => void;
}

export function useDonchianQuery(
  defaultConfig: DonchianConfig = { period: 20 },
  defaultShow: boolean = true
): UseDonchianQueryReturn {
  const [showDonchian, setShowDonchian] = useQueryState(
    "showDonchian",
    parseAsBoolean.withDefault(defaultShow)
  );

  const [period, setPeriod] = useQueryState(
    "donchianPeriod",
    parseAsInteger.withDefault(defaultConfig.period)
  );

  const donchianConfig: DonchianConfig = {
    period,
  };

  const updateDonchianPeriod = (newPeriod: number) => {
    setPeriod(newPeriod);
  };

  return {
    showDonchian,
    setShowDonchian,
    donchianConfig,
    updateDonchianPeriod,
  };
}
