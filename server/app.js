import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://saral-rates.vercel.app"],
  }),
);
app.use(express.json());

export default app;
