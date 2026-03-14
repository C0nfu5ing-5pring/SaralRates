import axios from "axios";
import Commodity from "../models/commodities.model.js";

export const fetchAndStoreData = async () => {
  try {
    const API_KEY = process.env.API_KEY;
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=10000`;

    const response = await axios.get(url);
    const records = response.data.records;

    if (!records || records.length === 0) {
      console.log("No data from API yet.");
      return false;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const todayRecords = records.filter(
      (r) => new Date(r.arrival_date).toISOString().split("T")[0] === todayStr,
    );

    if (todayRecords.length === 0) {
      console.log("Mandi data not posted yet.");
      return false;
    }

    for (const item of todayRecords) {
      await Commodity.updateOne(
        {
          state: item.state,
          district: item.district,
          market: item.market,
          commodity: item.commodity,
          variety: item.variety,
          arrival_date: new Date(item.arrival_date),
        },
        {
          $set: {
            min_price: Number(item.min_price),
            max_price: Number(item.max_price),
            modal_price: Number(item.modal_price),
            grade: item.grade,
          },
        },
        { upsert: true },
      );
    }

    console.log(`Updated. Records count: ${todayRecords.length}`);
    return true;
  } catch (err) {
    console.error("Error fetching mandi data:", err.message);
    return false;
  }
};

export const getCommodities = async (req, res) => {
  try {
    const commodities = await Commodity.find();
    res.json({ success: true, data: commodities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
