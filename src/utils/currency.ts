/**
 * Currency formatting utilities
 */

/**
 * Format currency amount with optional symbol
 * @param amount - The amount to format
 * @param currency - The currency code (USD, THB, etc.) - optional
 * @returns Formatted currency string
 */
export function formatAmount(
  amount: number,
  currency?: string,
  { noDecimals }: { noDecimals?: boolean } = {}
): string {
  const formattedNumber = amount.toLocaleString("en-US", {
    minimumFractionDigits: noDecimals ? 0 : 2,
    maximumFractionDigits: noDecimals ? 0 : 2,
  });

  if (!currency) {
    return formattedNumber;
  }

  const symbol = getCurrencySymbol(currency);
  return `${symbol} ${formattedNumber}`;
}

/**
 * Get currency symbol for a given currency code
 * @param currency - The currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency?: string): string {
  if (!currency) {
    return "";
  }

  switch (currency.toUpperCase()) {
    case "USD":
      return "$";
    case "THB":
      return "฿";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "JPY":
      return "¥";
    case "CNY":
      return "¥";
    case "KRW":
      return "₩";
    case "INR":
      return "₹";
    case "AUD":
      return "A$";
    case "CAD":
      return "C$";
    case "CHF":
      return "CHF";
    case "SEK":
      return "kr";
    case "NOK":
      return "kr";
    case "DKK":
      return "kr";
    case "PLN":
      return "zł";
    case "CZK":
      return "Kč";
    case "HUF":
      return "Ft";
    case "RUB":
      return "₽";
    case "BRL":
      return "R$";
    case "MXN":
      return "$";
    case "ZAR":
      return "R";
    case "TRY":
      return "₺";
    case "ILS":
      return "₪";
    case "AED":
      return "د.إ";
    case "SAR":
      return "ر.س";
    case "QAR":
      return "ر.ق";
    case "KWD":
      return "د.ك";
    case "BHD":
      return "د.ب";
    case "OMR":
      return "ر.ع.";
    case "JOD":
      return "د.أ";
    case "LBP":
      return "ل.ل";
    case "EGP":
      return "£";
    case "MAD":
      return "د.م.";
    case "TND":
      return "د.ت";
    case "DZD":
      return "د.ج";
    case "LYD":
      return "ل.د";
    case "SDG":
      return "ج.س.";
    case "ETB":
      return "Br";
    case "KES":
      return "KSh";
    case "UGX":
      return "USh";
    case "TZS":
      return "TSh";
    case "ZMW":
      return "ZK";
    case "BWP":
      return "P";
    case "SZL":
      return "L";
    case "LSL":
      return "L";
    case "NAD":
      return "N$";
    case "MZN":
      return "MT";
    case "AOA":
      return "Kz";
    case "XOF":
      return "CFA";
    case "XAF":
      return "FCFA";
    case "XPF":
      return "₣";
    default:
      return currency; // Return the currency code if no symbol is found
  }
}
