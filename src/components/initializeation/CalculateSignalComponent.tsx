"use client";

import { useCalculateSignal } from "@/hooks/signals/useCalculateSignal";

export default function CalculateSignalComponent() {
  useCalculateSignal();
  return null;
}
