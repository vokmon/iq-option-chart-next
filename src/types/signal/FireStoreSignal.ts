export type FireStoreSignalCollection = {
  oneMinute: string;
  fiveMinutes: string;
};

export type TradingSignal = {
  id: string;
  currencyPair: string;
  action: "BUY" | "SELL";
  zone: "Support zone" | "Resistance zone";
  timestamp: Date;
  timeframe: SignalTimeframe;
  signalType: SignalType;
  rawString?: string; // Original string format
};

export type RawSignalData = {
  signalString: string;
  timestamp: Date;
};

export type SignalTimeframe = keyof FireStoreSignalCollection;
export enum SignalType {
  REVERSAL = "reversal",
  OTC_REVERSAL = "otc_reversal",
}
