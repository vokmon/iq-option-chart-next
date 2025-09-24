export interface DonchianData {
  time: number;
  upper: number;
  lower: number;
  middle: number;
}

export interface DonchianConfig {
  period: number; // Default: 20
}

/**
 * Calculate Donchian Channels for a series of price data
 * @param highPrices Array of high prices
 * @param lowPrices Array of low prices
 * @param config Donchian configuration
 * @returns Array of Donchian data
 */
export function calculateDonchian(
  highPrices: number[],
  lowPrices: number[],
  config: DonchianConfig = { period: 20 }
): DonchianData[] {
  const { period } = config;
  const result: DonchianData[] = [];

  for (let i = period - 1; i < highPrices.length; i++) {
    // Get the slice of high and low prices for the current period
    const highSlice = highPrices.slice(i - period + 1, i + 1);
    const lowSlice = lowPrices.slice(i - period + 1, i + 1);

    // Calculate highest high and lowest low
    const upper = Math.max(...highSlice);
    const lower = Math.min(...lowSlice);
    const middle = (upper + lower) / 2;

    result.push({
      time: i,
      upper: upper,
      lower: lower,
      middle: middle,
    });
  }

  return result;
}

/**
 * Calculate Donchian Channels for candlestick data
 * @param candles Array of candlestick data with time, high, and low prices
 * @param config Donchian configuration
 * @returns Array of Donchian data with time
 */
export function calculateDonchianForCandles(
  candles: Array<{ time: number; high: number; low: number }>,
  config: DonchianConfig = { period: 20 }
): DonchianData[] {
  const highPrices = candles.map((candle) => candle.high);
  const lowPrices = candles.map((candle) => candle.low);
  const donchianData = calculateDonchian(highPrices, lowPrices, config);

  // Map the time from the original candles
  return donchianData.map((data, index) => ({
    ...data,
    time:
      candles[index + config.period - 1]?.time ||
      candles[candles.length - 1]?.time ||
      0,
  }));
}
