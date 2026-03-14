import app from "./app.js";
import connectToDB from "./src/db/db.js";
import commodityRoutes from "./src/routes/commodities.routes.js";
import "./src/cron/updatePrices.cron.js";

const PORT = 5050;
connectToDB();

app.use("/api", commodityRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
