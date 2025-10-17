"use client";

import { useDailyBalanceSnapshot } from "@/hooks/useDailyBalanceSnapshot";

export default function LoadDailyBalanceComponent() {
  useDailyBalanceSnapshot();
  return null;
}
