import { useAssetStore } from "@/stores/assetStore";
import { Balance } from "@quadcode-tech/client-sdk-js";

export function useTradingActions() {
  const { getActiveAsset } = useAssetStore();

  const handleCall = async (balance: Balance, amount: number) => {
    const activeAsset = getActiveAsset();

    const asset = activeAsset?.asset;
    const instruments = await asset?.instruments();
    const instrument = instruments?.getAvailableForBuyAt(new Date());
    console.log("Instrument:", instrument);

    console.log("=== CALL ORDER ===");
    console.log("Amount:", amount);
    console.log("Selected Asset:", activeAsset);
    console.log("Selected Balance ID:", balance);
    console.log("==================");

    // TODO: Implement actual call order logic here
  };

  const handlePut = (balance: Balance, amount: number) => {
    const activeAsset = getActiveAsset();

    console.log("=== PUT ORDER ===");
    console.log("Amount:", amount);
    console.log("Selected Asset:", activeAsset);
    console.log("Selected Balance ID:", balance);
    console.log("=================");

    // TODO: Implement actual put order logic here
  };

  return {
    onCall: handleCall,
    onPut: handlePut,
  };
}
