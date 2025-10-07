import { ClientSdk, Position } from "@quadcode-tech/client-sdk-js";
import { checkDayDifference, checkSameDay } from "./dateTime";

let isFetching = false;

export const getClosedPositionsForSelectedBalance = async ({
  sdk,
  dates,
}: {
  sdk: ClientSdk;
  dates: Date[];
}): Promise<Position[]> => {
  try {
    // const now = sdk.currentTime();
    const positions = await sdk.positions();

    const allClosedPositionsHistory = await positions.getPositionsHistory();

    if (!isFetching) {
      await allClosedPositionsHistory.fetchPrevPage();
      isFetching = true;
    }

    const allClosedPositions: { [key: number]: Position } = {};

    for (const date of dates) {
      let isFound = false;
      while (true) {
        const positions = allClosedPositionsHistory.getPositions();
        if (positions.length === 0) {
          if (allClosedPositionsHistory.hasPrevPage()) {
            await allClosedPositionsHistory.fetchPrevPage();
            continue;
          }
          break;
        }

        let foundDifferentDay = false;

        positions.forEach((position) => {
          if (position.closeTime) {
            const closeDate = new Date(position.closeTime);
            const currentDate = date;
            const isSameDay = checkSameDay(closeDate, currentDate);

            if (isSameDay) {
              isFound = true;
              foundDifferentDay = false;
              allClosedPositions[position.externalId!] = position;
            } else {
              foundDifferentDay = true;
            }

            // if the close date is before the current date
            // meaning the position is closed before the current date
            if (checkDayDifference(closeDate, currentDate) < 0) {
              isFound = true;
            }
          }
        });

        if (foundDifferentDay && isFound) {
          break;
        }
        if (allClosedPositionsHistory.hasPrevPage()) {
          await allClosedPositionsHistory.fetchPrevPage();
        } else {
          break;
        }
      }
    }

    return Object.values(allClosedPositions);
  } catch (error) {
    console.error("Error fetching closed positions:", error);
    throw error;
  }
};
