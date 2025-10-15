import { DigitalOptionsUnderlyingInstruments } from "@quadcode-tech/client-sdk-js";

export const getFirstAvailableInstrument = (
  instruments: DigitalOptionsUnderlyingInstruments,
  period: number,
  date: Date = new Date()
) => {
  const instrument = instruments?.getAvailableForBuyAt(date);
  const firstInstrument = instrument?.find(
    (instrument) => instrument.period === period
  );
  return firstInstrument;
};
