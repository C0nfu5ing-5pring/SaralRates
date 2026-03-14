import cron from "node-cron";
import { fetchAndStoreDataForCron } from "../controllers/commodities.controller.js";

let pollInterval = null;

cron.schedule("0 6 * * *", () => {
  console.log("Cron triggered at 3PM:", new Date().toLocaleTimeString());

  if (pollInterval) return;

  pollInterval = setInterval(
    async () => {
      console.log(
        "Polling API for today's data at",
        new Date().toLocaleTimeString(),
      );

      try {
        const success = await fetchAndStoreDataForCron();

        if (success) {
          console.log("Today's mandi data fetched and added to DB!");
          clearInterval(pollInterval);
          pollInterval = null;
        } else {
          console.log(
            "Today's data not posted by the govt. yet. Retrying in a minute",
          );
        }
      } catch (err) {
        console.error("Error during polling:", err.message);
      }
    },
    5 * 60 * 1000,
  );
});
