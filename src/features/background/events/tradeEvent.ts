import { SignalType } from "@/types/signal/Signal";

const SIGNAL_CHANGED_EVENT = "signal-changed";

export const tradeEvent = {
  SIGNAL_CHANGED_EVENT,
  dispatchSignalChangedEvent: (activeId: number, signal: SignalType) => {
    window.dispatchEvent(
      new CustomEvent(SIGNAL_CHANGED_EVENT, {
        detail: {
          activeId,
          signal,
        },
      })
    );
  },
  addEventListener: (callback: (event: Event) => void) => {
    window.addEventListener(SIGNAL_CHANGED_EVENT, callback as EventListener);
  },
  removeEventListener: (callback: (event: Event) => void) => {
    window.removeEventListener(SIGNAL_CHANGED_EVENT, callback as EventListener);
  },
};
