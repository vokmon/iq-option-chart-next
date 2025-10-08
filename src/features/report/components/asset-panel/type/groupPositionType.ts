import { Position } from "@quadcode-tech/client-sdk-js";

export interface GroupedPositions {
  [activeId: number]: Position[];
}
