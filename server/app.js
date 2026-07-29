import express from "express";
import cors from "cors";
import commodityRoutes from "./routes/commodities.routes.js";

const app = express();

app.use(
  cors({
    origin: ["https://saral-rates.vercel.app", "http://localhost:3000"],
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    endpoints: ["/api/commodities"],
  });
});

app.use("/api", commodityRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
