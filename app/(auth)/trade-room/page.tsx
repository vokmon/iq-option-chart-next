"use client";
import CalculateSignalComponent from "@/features/background/CalculateSignalComponent";
import AutoTradeBySignalComponent from "@/features/background/AutoTradeBySignalComponent";
import GraphPage from "@/features/graphs/components/GraphPage";
import TradeNotificationComponent from "@/features/background/TradeNotificationComponent";
import BreakWarningNotificationComponent from "@/features/background/TakeABreakNotificationComponent";

export default function Home() {
  return (
    <>
      <CalculateSignalComponent />
      <AutoTradeBySignalComponent />
      <TradeNotificationComponent />
      <BreakWarningNotificationComponent />
      <GraphPage />
    </>
  );
}
