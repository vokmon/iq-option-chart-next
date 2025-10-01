import { useAssetStore } from "@/stores/assetStore";
import { useSignalStore } from "@/stores/signalStore";
import SignalIndicatorLabel from "@/components/display/signal/SignalIndicatorLabel";
import EmptySignalIndicator from "@/components/display/signal/EmptySignalIndicator";

export default function SignalPanelController() {
  const { getActiveAsset } = useAssetStore();
  const activeAsset = getActiveAsset();
  const { getSignal } = useSignalStore();

  const signal = getSignal(activeAsset?.asset?.activeId || 0);
  return signal ? (
    <SignalIndicatorLabel signal={signal} />
  ) : (
    <EmptySignalIndicator />
  );
}
