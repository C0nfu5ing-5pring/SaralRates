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
  const now = new Date();
  const ist = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  return (
    String(ist.getUTCDate()).padStart(2, "0") +
    "/" +
    String(ist.getUTCMonth() + 1).padStart(2, "0") +
    "/" +
    ist.getUTCFullYear()
  );
};

const buildBulkOps = (records) =>
  records.map((item) => {
    const [day, month, year] = item.arrival_date.split("/");
    const arrivalDate = new Date(Date.UTC(year, month - 1, day));

    return {
      updateOne: {
        filter: {
          state: item.state,
          district: item.district,
          market: item.market,
          commodity: item.commodity,
          variety: item.variety,
          arrival_date: arrivalDate,
        },
        update: {
          $set: {
            grade: item.grade || "",
            min_price: Number(item.min_price) || 0,
            max_price: Number(item.max_price) || 0,
            modal_price: Number(item.modal_price) || 0,
          },
        },
        upsert: true,
      },
    };
  });

const fetchAndStore = async () => {
  const records = await fetchAllGovData();
  if (!records.length) return 0;

  const latestDate = records
    .map((r) => r.arrival_date)
    .sort()
    .at(-1);

  const todayStr = getTodayStr();

  if (latestDate !== todayStr) {
    console.warn(
      `API data is stale. Latest: ${latestDate}, Expected: ${todayStr}`,
    );
  }

  const latestRecords = records.filter((r) => r.arrival_date === latestDate);
  if (!latestRecords.length) return 0;

  const bulkOps = buildBulkOps(latestRecords);
  await Commodity.bulkWrite(bulkOps);

  const [day, month, year] = latestDate.split("/");
  const latestDateObj = new Date(Date.UTC(year, month - 1, day));
  const cutoff = new Date(latestDateObj);
  cutoff.setDate(cutoff.getDate() - 7);
  await Commodity.deleteMany({ arrival_date: { $lt: cutoff } });

  return latestRecords.length;
};

export const fetchAndStoreData = async (req, res) => {
  try {
    const count = await fetchAndStore();

    if (count === 0) {
      return res.status(200).json({
        success: true,
        message: "No mandi data available from source",
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
    const days = 5;

    const latest = await Commodity.findOne().sort({ arrival_date: -1 }).lean();

    if (!latest) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    const cutoff = new Date(latest.arrival_date);
    cutoff.setDate(cutoff.getDate() - days);

    const commodities = await Commodity.find({
      arrival_date: { $gte: cutoff },
    })
      .sort({ arrival_date: -1 })
      .lean();

    const map = new Map();

    for (const item of commodities) {
      const key = `${item.commodity}-${item.market}-${item.district}`;

      if (!map.has(key)) {
        map.set(key, {
          commodity: item.commodity,
          market: item.market,
          district: item.district,
          state: item.state,
          variety: item.variety,
          grade: item.grade,
          arrival_date: item.arrival_date,
          modal_price: item.modal_price,
          min_price: item.min_price,
          max_price: item.max_price,
          priceHistory: [],
        });
      }

      const entry = map.get(key);

      if (entry.priceHistory.length < days) {
        entry.priceHistory.push({
          date: item.arrival_date,
          modal_price: item.modal_price,
          min_price: item.min_price,
          max_price: item.max_price,
        });
      }
    }

    const result = Array.from(map.values()).map((commodity) => {
      let prev = null;

      const priceHistory = commodity.priceHistory.map((item) => {
        let trend = "same";

        if (prev !== null) {
          if (item.modal_price > prev) trend = "up";
          else if (item.modal_price < prev) trend = "down";
        }

        prev = item.modal_price;
        return { ...item, trend };
      });

      return { ...commodity, priceHistory };
    });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result.slice(0, 500),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
