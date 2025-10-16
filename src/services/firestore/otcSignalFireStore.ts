import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { FireStoreSignalCollection } from "@/types/signal/FireStoreSignal";

const firebaseOtcConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIRESTORE_OTC_SIGNAL_CONFIG!
);

const firestoreOtcSignalCollections = JSON.parse(
  process.env.NEXT_PUBLIC_OTC_SIGNAL_COLLECTIONS!
);

// Initialize Firebase
const otcApp = initializeApp(firebaseOtcConfig, "otcSignalApp");
const otcDb = getFirestore(otcApp);

export function getOtcSignalData(collectionName: string) {
  const collectionRef = collection(otcDb, collectionName);
  return collectionRef;
}

export function getOtcSignalCollections(): FireStoreSignalCollection {
  return firestoreOtcSignalCollections as FireStoreSignalCollection;
}
