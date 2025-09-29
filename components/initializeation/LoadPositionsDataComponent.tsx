"use client";

import {
  useGetClosedPositions,
  useGetOpenPositions,
} from "@/hooks/useGetPositions";

export default function LoadPositionsDataComponent() {
  useGetOpenPositions();
  useGetClosedPositions();
  return null;
}
