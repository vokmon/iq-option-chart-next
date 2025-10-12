import { DigitalOptionsUnderlyingInstruments } from "@quadcode-tech/client-sdk-js";

export const getFirstAvailableInstrument = (
  instruments: DigitalOptionsUnderlyingInstruments,
  period: number
) => {
  const instrument = instruments?.getAvailableForBuyAt(new Date());
  const firstInstrument = instrument?.find(
    (instrument) => instrument.period === period
  );
  return firstInstrument;
};
