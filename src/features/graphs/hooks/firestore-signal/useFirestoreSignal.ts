import { useState, useEffect } from "react";
import {
  FireStoreSignalCollection,
  SignalType,
  TradingSignal,
} from "@/types/signal/FireStoreSignal";
import { useFirestoreSignalStore } from "@/stores/firestoreSignalStore";
import {
  getSignalCollections,
  getSignalData,
} from "@/services/firestore/signalFireStore";
import {
  getOtcSignalCollections,
  getOtcSignalData,
} from "@/services/firestore/otcSignalFireStore";
import {
  CollectionReference,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from "firebase/firestore";

const LIMIT = 15;
const FETCH_LIMIT = 10;

// Utility function to parse signal strings
// Example input: "GBPCAD | Buy 🔺 [Support zone]"
// Output: { currencyPair: "GBPCAD", action: "BUY", zone: "Support zone", rawString: "GBPCAD | Buy 🔺 [Support zone]" }
const parseSignalString = (
  signalString: string
): Partial<TradingSignal> | null => {
  try {
    // Remove emojis and clean the string
    const cleanString = signalString.replace(/[🔺🔻]/g, "").trim();

    // Split by "|" to get parts
    const parts = cleanString.split("|").map((part) => part.trim());

    if (parts.length < 2) return null;

    const currencyPair = parts[0];
    const actionPart = parts[1];

    // Extract action (Buy/Sell)
    const action = actionPart.toLowerCase().includes("buy") ? "BUY" : "SELL";

    // Extract zone from brackets
    const zoneMatch = signalString.match(/\[([^\]]+)\]/);
    const zone = zoneMatch
      ? (zoneMatch[1] as "Support zone" | "Resistance zone")
      : "Support zone";

    return {
      currencyPair,
      action,
      zone,
      rawString: signalString,
    };
  } catch (error) {
    console.error("Error parsing signal string:", error);
    return null;
  }
};

const unique = <T>(arr: T[], attr: keyof T): T[] => {
  if (!arr || arr.length === 0) {
    return [];
  }

  const seen = new Set();
  return arr.filter((item) => {
    const value = item[attr];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
};

const sortByCreatedDate = (arr: TradingSignal[]) =>
  arr.sort((a: TradingSignal, b: TradingSignal) => {
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

export function useFirestoreSignal() {
  const { selectedTimeframe, selectedSignalType } = useFirestoreSignalStore();
  const [filteredSignals, setFilteredSignals] = useState<TradingSignal[]>([]);
  useEffect(() => {
    setFilteredSignals([]);
    const signalCollection: FireStoreSignalCollection =
      selectedSignalType === SignalType.REVERSAL
        ? getSignalCollections()
        : getOtcSignalCollections();

    const getCollectionRef: (
      collectionName: string
    ) => CollectionReference<DocumentData, DocumentData> =
      selectedSignalType === SignalType.REVERSAL
        ? getSignalData
        : getOtcSignalData;

    const collectionName = signalCollection[selectedTimeframe];
    const collectionRef = getCollectionRef(collectionName);

    const qListener = query(
      collectionRef,
      orderBy("created", "desc"),
      limit(1)
    );

    const buildSignals = (
      querySnapshot: QuerySnapshot<DocumentData>,
      isAppend: boolean = false
    ) => {
      const signals: TradingSignal[] = [];
      querySnapshot.forEach((doc) => {
        const id = doc.id;
        const rawString = doc.data().message;
        const docTimestamp = doc.data().created.seconds * 1000;
        const signal = parseSignalString(rawString);

        if (!signal) return;

        const signalObject: TradingSignal = {
          id: id,
          currencyPair: signal.currencyPair,
          action: signal.action,
          zone: signal.zone,
          timestamp: new Date(docTimestamp), // Mock timestamps
          timeframe: selectedTimeframe,
          signalType: selectedSignalType,
          rawString: rawString,
        } as TradingSignal;

        signals.push(signalObject);
      });

      setFilteredSignals((prev) => {
        const newSignals = isAppend ? [...prev, ...signals] : signals;
        const uniquesignals = sortByCreatedDate(unique(newSignals, "id")).slice(
          0,
          LIMIT
        );
        return uniquesignals;
      });
    };

    const fetchSignals = async () => {
      const q = query(
        collectionRef,
        orderBy("created", "desc"),
        limit(FETCH_LIMIT)
      );
      const querySnapshot = await getDocs(q);
      buildSignals(querySnapshot, false);
    };

    fetchSignals();
    const unsubscribe = onSnapshot(
      qListener,
      (querySnapshotListener) => {
        buildSignals(querySnapshotListener, true);
        querySnapshotListener.docChanges().forEach((change) => {
          if (change.type === "added") {
            // newMessageIds.push(change.doc.id);
            // $w("#audioPlayer1").play();
          }
        });
      },
      (error) => {
        console.error(error);
      }
    );
    return () => unsubscribe();
  }, [selectedTimeframe, selectedSignalType]);
  // Convert mock signals to structured format using selected states
  // const mockSignals = useMemo(() => {
  //   return mockRawSignals
  //     .map((signalString, index) => {
  //       const parsed = parseSignalString(signalString);
  //       if (!parsed || !parsed.currencyPair || !parsed.action || !parsed.zone)
  //         return null;

  //       return {
  //         id: (index + 1).toString(),
  //         currencyPair: parsed.currencyPair,
  //         action: parsed.action,
  //         zone: parsed.zone,
  //         timestamp: new Date(Date.now() - index * 60000), // Mock timestamps
  //         timeframe: selectedTimeframe,
  //         signalType: selectedSignalType,
  //         rawString: parsed.rawString || signalString,
  //       } as TradingSignal;
  //     })
  //     .filter((signal): signal is TradingSignal => signal !== null);
  // }, [selectedTimeframe, selectedSignalType]);

  // // Filter signals based on selected criteria (now all signals match the selected criteria)
  // const filteredSignals = useMemo(() => {
  //   return mockSignals;
  // }, [mockSignals]);

  return {
    filteredSignals,
  };
}
