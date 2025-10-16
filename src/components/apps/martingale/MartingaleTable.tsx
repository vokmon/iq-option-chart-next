import { formatAmount } from "@/utils/currency";
import { useTranslations } from "next-intl";

type MartingaleTableProps = {
  title: string;
  orderAmount: number;
  incrementRates: number[];
  brokerPercentage: number;
  suggestedInvesmentPercentage: number;
};

export default function MartingaleTable({
  title,
  orderAmount,
  incrementRates,
  brokerPercentage,
  suggestedInvesmentPercentage,
}: MartingaleTableProps) {
  const t = useTranslations();
  // Calculate martingale orders
  const orders = [];
  let currentAmount = orderAmount;
  let previousTotalAmount = 0;

  // First order
  orders.push({
    name: "Order",
    amount: currentAmount,
    profit: currentAmount * (brokerPercentage / 100),
  });

  previousTotalAmount = currentAmount;

  // Martingale orders
  incrementRates.forEach((rate, index) => {
    currentAmount = currentAmount * rate;
    const profit =
      currentAmount * (brokerPercentage / 100) - previousTotalAmount;

    orders.push({
      name: `Martingale ${index + 1}`,
      amount: currentAmount,
      profit: profit,
    });

    previousTotalAmount += currentAmount;
  });

  // Calculate totals
  const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalProfit = orders.reduce((sum, order) => sum + order.profit, 0);
  const stopLoss = totalAmount;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-3">
        <h2 className="text-lg font-semibold text-center">{title}</h2>
      </div>

      {/* Martingale Orders Table */}
      <div className="p-4">
        <div className="overflow-hidden rounded-lg border border-gray-200">
          {/* Table Header */}
          <div className="bg-gray-100 grid grid-cols-3 text-sm font-medium text-gray-700">
            <div className="px-3 py-2 text-left">{t("Order")}</div>
            <div className="px-3 py-2 text-right">{t("Amount")}</div>
            <div className="px-3 py-2 text-right">{t("Profit")}</div>
          </div>

          {/* Table Rows */}
          {orders.map((order, index) => (
            <div
              key={index}
              className="grid grid-cols-3 text-sm border-t border-gray-200 hover:bg-gray-50"
            >
              <div className="px-3 py-2 text-left text-gray-900">
                {order.name}
              </div>
              <div className="px-3 py-2 text-right text-gray-900 font-medium">
                {formatAmount(order.amount)}
              </div>
              <div className="px-3 py-2 text-right text-gray-900 font-medium">
                {formatAmount(order.profit)}
              </div>
            </div>
          ))}

          {/* Total Row */}
          <div className="grid grid-cols-3 text-sm font-semibold bg-gray-50 border-t-2 border-gray-300">
            <div className="px-3 py-2 text-left text-gray-900">
              {t("Total")}
            </div>
            <div className="px-3 py-2 text-right text-gray-900">
              {formatAmount(totalAmount)}
            </div>
            <div className="px-3 py-2 text-right text-gray-900">
              {formatAmount(totalProfit)}
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h3 className="text-center text-sm font-medium text-gray-700 mb-3">
            {t("Recommendations")}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("Stop Loss")}</span>
              <span className="font-medium text-gray-900">
                {formatAmount(stopLoss)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">
                {t("Recommended Investment")}
              </span>
              <span className="font-medium text-gray-900">
                {t("of portfolio", { amount: suggestedInvesmentPercentage })}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t("Portfolio Balance")}</span>
              <span className="font-medium text-gray-900">
                {formatAmount(stopLoss * suggestedInvesmentPercentage)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
