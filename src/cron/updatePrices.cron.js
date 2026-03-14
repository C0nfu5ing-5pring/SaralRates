import cron from "node-cron";
import { fetchAndStoreData } from "../controllers/commodities.controller.js";

cron.schedule("0 6 * * *", () => {
  console.log("Cron fired at 6AM");

  const pollInterval = setInterval(
    async () => {
      const success = await fetchAndStoreData();

      if (success) {
        console.log("added today's data in db");
        clearInterval(pollInterval);
      } else {
        console.log("dta not posted yet. Retrying in 5 mins.");
      }
    },
    5 * 60 * 1000,
  );
});
