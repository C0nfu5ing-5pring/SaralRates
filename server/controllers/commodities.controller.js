import axios from "axios";
import Commodity from "../models/commodities.model.js";

const API_KEY = process.env.API_KEY;

const BASE_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const fetchAllGovData = async () => {
  const limit = 10000;
  let offset = 0;
  const allRecords = [];

  while (true) {
    const url =
      `${BASE_URL}?api-key=${API_KEY}` +
      `&format=json` +
      `&limit=${limit}` +
      `&offset=${offset}`;

    const response = await axios.get(url);
    const records = response.data.records;

    if (!records || records.length === 0) break;

    allRecords.push(...records);

    if (records.length < limit) break;

    offset += limit;
  }

  return allRecords;
};

const getTodayStr = () => {
  const today = new Date();
  return (
    String(today.getUTCDate()).padStart(2, "0") +
    "/" +
    String(today.getUTCMonth() + 1).padStart(2, "0") +
    "/" +
    today.getUTCFullYear()
  );
};

const buildBulkOps = (records) =>
  records.map((item) => {
    const [day, month, year] = item.arrival_date.split("/");
    const arrivalDate = new Date(Date.UTC(year, month - 1, day));

    const historyEntry = {
      date: arrivalDate,
      modal_price: Number(item.modal_price) || 0,
      min_price: Number(item.min_price) || 0,
      max_price: Number(item.max_price) || 0,
    };

    return {
      updateOne: {
        filter: {
          commodity: item.commodity,
          market: item.market,
          district: item.district,
          "latest.date": { $ne: arrivalDate },
        },
        update: {
          $set: {
            state: item.state,
            variety: item.variety,
            grade: item.grade || "",
            latest: historyEntry,
          },
          $push: {
            history: {
              $each: [historyEntry],
              $position: 0,
              $slice: 5,
            },
          },
        },
        upsert: true,
      },
    };
  });

const fetchAndStore = async () => {
  const records = await fetchAllGovData();
  if (!records.length) return 0;

  const todayStr = getTodayStr();
  const todayRecords = records.filter((r) => r.arrival_date === todayStr);
  if (!todayRecords.length) return 0;

  const bulkOps = buildBulkOps(todayRecords);
  await Commodity.bulkWrite(bulkOps);

  return todayRecords.length;
};

export const fetchAndStoreData = async (req, res) => {
  try {
    const count = await fetchAndStore();

    if (count === 0) {
      return res.status(200).json({
        success: true,
        message: "Mandi data not posted by the government yet",
      });
    }

    res.status(200).json({
      success: true,
      message: `Updated ${count} records`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const fetchAndStoreDataForCron = async () => {
  try {
    const count = await fetchAndStore();
    return count > 0;
  } catch {
    return false;
  }
};

export const getCommodities = async (req, res) => {
  try {
    const commodities = await Commodity.find()
      .sort({ "latest.date": -1 })
      .limit(500)
      .lean();

    const result = commodities.map((item) => {
      let prev = null;

      const priceHistory = (item.history || []).map((h) => {
        let trend = "same";

        if (prev !== null) {
          if (h.modal_price > prev) trend = "up";
          else if (h.modal_price < prev) trend = "down";
        }

        prev = h.modal_price;
        return { ...h, trend };
      });

      return {
        commodity: item.commodity,
        market: item.market,
        district: item.district,
        state: item.state,
        variety: item.variety,
        grade: item.grade,
        arrival_date: item.latest?.date || null,
        modal_price: item.latest?.modal_price || 0,
        min_price: item.latest?.min_price || 0,
        max_price: item.latest?.max_price || 0,
        priceHistory,
      };
    });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
