"use client";

import { Balance } from "@quadcode-tech/client-sdk-js";
import { Text } from "@mantine/core";
import BalanceCard from "./BalanceCard";

type BalanceListProps = {
  balances: Balance[];
};

export default function BalanceList({ balances }: BalanceListProps) {
  if (balances.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md py-8 px-6 border border-gray-200 dark:border-gray-700 text-center">
        <Text size="sm" c="var(--mantine-color-gray-6)">
          No balances available
        </Text>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {balances.map((balance) => (
        <BalanceCard key={balance.id} balance={balance} />
      ))}
    </div>
  );
}
