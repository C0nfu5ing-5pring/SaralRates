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
    const days = 5;

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    cutoff.setUTCHours(0, 0, 0, 0);

    const commodities = await Commodity.aggregate([
      {
        $match: { arrival_date: { $gte: cutoff } },
      },
      {
        $sort: { arrival_date: -1 },
      },
      {
        $group: {
          _id: {
            commodity: "$commodity",
            market: "$market",
            district: "$district",
          },
          latestDoc: { $first: "$$ROOT" },
          priceHistory: {
            $push: {
              date: "$arrival_date",
              modal_price: "$modal_price",
              min_price: "$min_price",
              max_price: "$max_price",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          commodity: "$_id.commodity",
          market: "$_id.market",
          district: "$_id.district",
          state: "$latestDoc.state",
          variety: "$latestDoc.variety",
          grade: "$latestDoc.grade",
          arrival_date: "$latestDoc.arrival_date",
          modal_price: "$latestDoc.modal_price",
          min_price: "$latestDoc.min_price",
          max_price: "$latestDoc.max_price",
          priceHistory: {
            $slice: ["$priceHistory", days],
          },
        },
      },
      { $sort: { arrival_date: -1 } },
    ]).allowDiskUse(true);

    const commoditiesWithTrend = commodities.map((commodity) => {
      let prev = null;

      const priceHistoryWithTrend = commodity.priceHistory.map((item) => {
        let trend = "same";

        if (prev !== null) {
          if (item.modal_price > prev) trend = "up";
          else if (item.modal_price < prev) trend = "down";
        }

        prev = item.modal_price;
        return { ...item, trend };
      });

      return { ...commodity, priceHistory: priceHistoryWithTrend };
    });

    res.status(200).json({
      success: true,
      count: commoditiesWithTrend.length,
      data: commoditiesWithTrend,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
