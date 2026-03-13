import axios from "axios";
import Commodity from "../models/commodities.model.js";

export const fetchAndStoreData = async (req, res) => {
  try {
    console.log("Route hit");

    const API_KEY = process.env.API_KEY;
    console.log("API KEY:", process.env.API_KEY);

    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=10000`;

    const response = await axios.get(url);

    const records = response.data.records;

    const formatted = records.map((item) => ({
      state: item.state,
      district: item.district,
      market: item.market,
      commodity: item.commodity,
      variety: item.variety,
      arrival_date: new Date(item.arrival_date.split("/").reverse().join("-")),
      min_price: Number(item.min_price),
      max_price: Number(item.max_price),
      modal_price: Number(item.modal_price),
      grade: item.grade,
    }));

    await Commodity.insertMany(formatted);

    res.json({
      message: "Records stored successfully",
      count: formatted.length,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
};

export const getCommodities = async (req, res) => {
  try {
    const commodities = await Commodity.find();

    res.json({
      success: true,
      data: commodities,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};
