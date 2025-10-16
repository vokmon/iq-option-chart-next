import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { FireStoreSignalCollection } from "@/types/signal/FireStoreSignal";

const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIRESTORE_SIGNAL_CONFIG!
);

const firestoreSignalCollections = JSON.parse(
  process.env.NEXT_PUBLIC_SIGNAL_COLLECTIONS!
);

// Initialize Firebase
const app = initializeApp(firebaseConfig, "signalApp");
const db = getFirestore(app);

export function getSignalData(collectionName: string) {
  const collectionRef = collection(db, collectionName);
  return collectionRef;
}

export function getSignalCollections(): FireStoreSignalCollection {
  return firestoreSignalCollections as FireStoreSignalCollection;
}
