"use client";

import { useDailyBalanceSnapshot } from "@/hooks/useDailyBalanceSnapshot";
import { useAmountHistoryStore } from "@/stores/assets/amountHistoryStore";

export default function LoadDailyBalanceComponent() {
  useAmountHistoryStore();
  useDailyBalanceSnapshot();
  return null;
}
