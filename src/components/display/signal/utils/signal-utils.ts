import { SignalType } from "@/types/signal/Signal";
import {
  IconClockPause,
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

export const useGetSignalConfig = (signalType: SignalType) => {
  const t = useTranslations();
  switch (signalType) {
    case SignalType.CALL:
      return {
        color: "green",
        icon: IconTrendingUp,
        text: t("CALL"),
        classes: "bg-green-50 border-green-300 text-green-800",
        iconGradient:
          "bg-gradient-to-br from-green-400 to-green-600 animate-pulse",
      };
    case SignalType.PUT:
      return {
        color: "red",
        icon: IconTrendingDown,
        text: t("PUT"),
        classes: "bg-red-50 border-red-300 text-red-800",
        iconGradient: "bg-gradient-to-br from-red-400 to-red-600 animate-pulse",
      };
    case SignalType.HOLD:
      return {
        color: "orange",
        icon: IconClockPause,
        text: t("HOLD"),
        classes: "bg-orange-50 border-orange-300 text-orange-800",
        iconGradient: "bg-gradient-to-br from-orange-400 to-orange-600",
      };
    default:
      return {
        color: "gray",
        icon: IconMinus,
        text: "UNKNOWN",
        classes: "bg-gray-50 border-gray-300 text-gray-800",
        iconGradient: "bg-gradient-to-br from-gray-400 to-gray-600",
      };
  }
};
