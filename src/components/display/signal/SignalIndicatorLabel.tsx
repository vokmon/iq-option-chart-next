import { Text, Indicator } from "@mantine/core";
import { SignalType } from "@/types/signal/Signal";
import { useTranslations } from "next-intl";
import { useGetSignalConfig } from "./utils/signal-utils";
import { useAnimationTrigger } from "@/components/ui/hooks/useAnimationTrigger";

export interface SignalIndicatorLabelProps {
  signal: SignalType;
}

export default function SignalIndicatorLabel({
  signal,
}: SignalIndicatorLabelProps) {
  const t = useTranslations();
  const isAnimating = useAnimationTrigger(signal);

  const config = useGetSignalConfig(signal);
  const IconComponent = config.icon;

  return (
    <Indicator
      className="w-full h-full"
      inline
      processing
      color={config.color}
      offset={2}
      size={30}
      withBorder
      position="top-start"
      disabled={signal === SignalType.HOLD}
    >
      <div
        className={`w-full h-full transition-all duration-200 ${
          isAnimating ? "animate-fade-in" : ""
        }`}
      >
        <div
          className={`w-full h-full flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-default select-none px-4 py-2 text-base rounded-lg border shadow-sm ${config.classes}`}
        >
          <div className="flex flex-row no-wrap gap-3 items-center">
            <div className="relative">
              <div
                className={`w-7 h-7 rounded-full ${config.iconGradient} shadow-lg flex items-center justify-center`}
              >
                <IconComponent size={18} className="text-white" />
              </div>
            </div>

            <Text size="sm" fw={700} className="uppercase tracking-wide">
              {config.text}
              {(signal === SignalType.CALL || signal === SignalType.PUT) && (
                <span className="normal-case font-medium ml-2 opacity-80 text-md">
                  {t("Resistance zone")}
                </span>
              )}
            </Text>
          </div>
        </div>
      </div>
    </Indicator>
  );
}
