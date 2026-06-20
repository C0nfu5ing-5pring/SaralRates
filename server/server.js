import app from "./app.js";
import commodityRoutes from "./routes/commodities.routes.js";
import "./cron/updatePrices.cron.js";

const PORT = 5050;

app.use("/api", commodityRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
