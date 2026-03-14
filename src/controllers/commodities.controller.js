import axios from "axios";
import Commodity from "../models/commodities.model.js";

export const fetchAndStoreData = async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=10000`;

    const response = await axios.get(url);
    const records = response.data.records;

    if (!records || records.length === 0) {
      console.log("No data from API yet");
      return res.status(200).json({ message: "No data from API yet" });
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const todayRecords = records.filter((r) => {
      if (!r.arrival_date) return false;
      const date = new Date(r.arrival_date);
      return !isNaN(date) && date.toISOString().split("T")[0] === todayStr;
    });

    if (todayRecords.length === 0) {
      console.log("Mandi data not posted by the government yet");
      return res
        .status(200)
        .json({ message: "Mandi data not posted by the government yet" });
    }

    const bulkOps = todayRecords.map((item) => ({
      updateOne: {
        filter: {
          state: item.state,
          district: item.district,
          market: item.market,
          commodity: item.commodity,
          variety: item.variety,
          arrival_date: new Date(item.arrival_date),
        },
        update: {
          $set: {
            min_price: Number(item.min_price) || 0,
            max_price: Number(item.max_price) || 0,
            modal_price: Number(item.modal_price) || 0,
            grade: item.grade || "",
          },
        },
        upsert: true,
      },
    }));

    await Commodity.bulkWrite(bulkOps);

    console.log(`Updated. Records count: ${todayRecords.length}`);
    return res
      .status(200)
      .json({ message: `Updated ${todayRecords.length} records` });
  } catch (err) {
    console.error("Error fetching mandi data:", err.message);
    return res.status(500).json({ error: err.message });
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

export const fetchAndStoreDataForCron = async () => {
  try {
    const API_KEY = process.env.API_KEY;
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=10000`;

    const response = await axios.get(url);
    const records = response.data.records;

    if (!records || records.length === 0) {
      console.log("No data from API yet");
      return false;
    }

    const todayStr = new Date().toISOString().split("T")[0];

    const todayRecords = records.filter((r) => {
      if (!r.arrival_date) return false;
      const date = new Date(r.arrival_date);
      return !isNaN(date) && date.toISOString().split("T")[0] === todayStr;
    });

    if (todayRecords.length === 0) {
      console.log("Mandi data not posted by the government yet");
      return false;
    }

    const bulkOps = todayRecords.map((item) => ({
      updateOne: {
        filter: {
          state: item.state,
          district: item.district,
          market: item.market,
          commodity: item.commodity,
          variety: item.variety,
          arrival_date: new Date(item.arrival_date),
        },
        update: {
          $set: {
            min_price: Number(item.min_price) || 0,
            max_price: Number(item.max_price) || 0,
            modal_price: Number(item.modal_price) || 0,
            grade: item.grade || "",
          },
        },
        upsert: true,
      },
    }));

    await Commodity.bulkWrite(bulkOps);

    console.log(`Updated. Records count: ${todayRecords.length}`);
    return true;
  } catch (err) {
    console.error("Error fetching mandi data:", err.message);
    return false;
  }
};
