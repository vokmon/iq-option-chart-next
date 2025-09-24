import { useQueryState, parseAsBoolean, parseAsInteger } from "nuqs";
import { type StochasticConfig } from "@/utils/indicators/stochastic";

export interface UseStochasticQueryReturn {
  showStochastic: boolean;
  setShowStochastic: (show: boolean) => void;
  stochasticConfig: StochasticConfig;
  updateKPeriod: (kPeriod: number) => void;
  updateDPeriod: (dPeriod: number) => void;
  updateSmoothing: (smoothing: number) => void;
}

export function useStochasticQuery(
  defaultConfig: StochasticConfig = { kPeriod: 13, dPeriod: 3, smoothing: 3 },
  defaultShow: boolean = true
): UseStochasticQueryReturn {
  const [showStochastic, setShowStochastic] = useQueryState(
    "showStochastic",
    parseAsBoolean.withDefault(defaultShow)
  );

  const [kPeriod, setKPeriod] = useQueryState(
    "stochasticKPeriod",
    parseAsInteger.withDefault(defaultConfig.kPeriod)
  );

  const [dPeriod, setDPeriod] = useQueryState(
    "stochasticDPeriod",
    parseAsInteger.withDefault(defaultConfig.dPeriod)
  );

  const [smoothing, setSmoothing] = useQueryState(
    "stochasticSmoothing",
    parseAsInteger.withDefault(defaultConfig.smoothing)
  );

  const stochasticConfig: StochasticConfig = {
    kPeriod,
    dPeriod,
    smoothing,
  };

  const updateKPeriod = (newKPeriod: number) => {
    setKPeriod(newKPeriod);
  };

  const updateDPeriod = (newDPeriod: number) => {
    setDPeriod(newDPeriod);
  };

  const updateSmoothing = (newSmoothing: number) => {
    setSmoothing(newSmoothing);
  };

  return {
    showStochastic,
    setShowStochastic,
    stochasticConfig,
    updateKPeriod,
    updateDPeriod,
    updateSmoothing,
  };
}
