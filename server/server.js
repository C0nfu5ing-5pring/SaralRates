import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "API is running",
    endpoints: ["/api/commodities"],
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});
export default app;
