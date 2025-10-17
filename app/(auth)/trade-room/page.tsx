"use client";
import CalculateSignalComponent from "@/features/background/CalculateSignalComponent";
import AutoTradeBySignalComponent from "@/features/background/AutoTradeBySignalComponent";
import MartingaleIntegrationComponent from "@/features/background/MartingaleIntegrationComponent";
import GraphPage from "@/features/graphs/components/GraphPage";

export default function Home() {
  return (
    <>
      <CalculateSignalComponent />
      <AutoTradeBySignalComponent />
      <MartingaleIntegrationComponent />

      <GraphPage />
    </>
  );
}
