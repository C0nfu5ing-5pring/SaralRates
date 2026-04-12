import cron from "node-cron";
import { fetchAndStoreDataForCron } from "../controllers/commodities.controller.js";

let pollInterval = null;
let isRunning = false;

cron.schedule(
  "43 8 * * *",
  () => {
    console.log("Cron triggered at:", new Date().toLocaleTimeString());

    if (pollInterval) return;

    pollInterval = setInterval(
      async () => {
        if (isRunning) return;
        isRunning = true;

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
              "Today's data not posted by the govt. yet. Retrying...",
            );
          }
        } catch (err) {
          console.error("Error during polling:", err.message);
        } finally {
          isRunning = false;
        }
      },
      1 * 60 * 1000,
    );
  },
  { timezone: "Asia/Kolkata" },
);
