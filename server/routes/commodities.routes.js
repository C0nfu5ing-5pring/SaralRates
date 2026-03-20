import express from "express";
import {
  fetchAndStoreData,
  getCommodities,
} from "../controllers/commodities.controller.js";

const router = express.Router();

router.get("/fetch-mandi", fetchAndStoreData);
router.get("/commodities", getCommodities);

export default router;
