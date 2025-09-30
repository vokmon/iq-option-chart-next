"use client";

import { useGetClosedPositions } from "@/hooks/positions/useGetClosedPositions";
import { useGetOpenPositions } from "@/hooks/positions/useGetOpenPositions";
import { useSubscribeToPositionsUpdates } from "@/hooks/positions/useSubscribeToPositionsUpdates";

export default function LoadPositionsDataComponent() {
  useGetOpenPositions();
  useGetClosedPositions();
  useSubscribeToPositionsUpdates();
  return null;
}
