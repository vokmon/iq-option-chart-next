"use client";

import { ScrollArea, Box } from "@mantine/core";
import SignalFirestoreSelector from "@/components/display/signal-firestore/SignalFirestoreSelector";
import SignalFirestoreEmptyState from "@/components/display/signal-firestore/SignalFirestoreEmptyState";
import SignalFirestoreTable from "@/components/display/signal-firestore/SignalFirestoreTable";
import { useTranslations } from "next-intl";
import { useFirestoreSignal } from "../../hooks/firestore-signal/useFirestoreSignal";
import { useFirestoreSignalStore } from "@/stores/firestoreSignalStore";
import { SignalType } from "@/types/signal/FireStoreSignal";
import { useSelectFirestoreSignal } from "../../hooks/firestore-signal/useSelectFirestoreSignal";
import { useDigitalOptionsStore } from "@/stores/digitalOptionsStore";

export default function FireStoreSignalPanelController() {
  const t = useTranslations();
  const { filteredSignals } = useFirestoreSignal();

  const {
    selectedTimeframe,
    selectedSignalType,
    setSelectedTimeframe,
    setSelectedSignalType,
  } = useFirestoreSignalStore();

  const { actives } = useDigitalOptionsStore();
  const { handleSelectSignal } = useSelectFirestoreSignal();

  return (
    <div className="h-full flex flex-col">
      {/* Header Section */}
      <SignalFirestoreSelector
        selectedTimeframe={selectedTimeframe}
        selectedSignalType={selectedSignalType}
        onTimeframeChange={setSelectedTimeframe}
        onSignalTypeChange={setSelectedSignalType}
        timeframeOptions={[
          { label: t("oneMinute"), value: "oneMinute" },
          { label: t("fiveMinutes"), value: "fiveMinutes" },
        ]}
        signalTypeOptions={[
          { label: t("reversal"), value: SignalType.REVERSAL },
          { label: t("otc_reversal"), value: SignalType.OTC_REVERSAL },
        ]}
      />

      {/* Signals Table */}
      <Box className="flex-1 min-h-0">
        {filteredSignals.length === 0 ? (
          <SignalFirestoreEmptyState message={t("No signals available")} />
        ) : (
          <ScrollArea className="h-full" scrollbarSize={6}>
            <SignalFirestoreTable
              signals={filteredSignals}
              onSignalClick={handleSelectSignal}
              actives={actives}
            />
          </ScrollArea>
        )}
      </Box>
    </div>
  );
}
