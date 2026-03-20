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

export const fetchAndStoreData = async (req, res) => {
  try {
    const records = await fetchAllGovData();

    if (!records.length) {
      return res.status(200).json({
        message: "No data from API yet",
      });
    }

    const today = new Date();

    const todayStr =
      String(today.getUTCDate()).padStart(2, "0") +
      "/" +
      String(today.getUTCMonth() + 1).padStart(2, "0") +
      "/" +
      today.getUTCFullYear();

    const todayRecords = records.filter((r) => r.arrival_date === todayStr);

    if (!todayRecords.length) {
      return res.status(200).json({
        message: "Mandi data not posted by the government yet",
      });
    }

    const bulkOps = todayRecords.map((item) => {
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

    await Commodity.bulkWrite(bulkOps);

    console.log("Total API records:", records.length);
    console.log("Today's records:", todayRecords.length);

    res.status(200).json({
      success: true,
      message: `Updated ${todayRecords.length} records`,
    });
  } catch (err) {
    console.error("Error fetching mandi data:", err.message);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getCommodities = async (req, res) => {
  try {
    const days = 5;

    const commodities = await Commodity.aggregate([
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
          state: { $first: "$state" },
          variety: { $first: "$variety" },
          grade: { $first: "$grade" },
          latest: { $first: "$$ROOT" },
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
          state: 1,
          variety: 1,
          grade: 1,
          arrival_date: "$latest.arrival_date",
          modal_price: "$latest.modal_price",
          min_price: "$latest.min_price",
          max_price: "$latest.max_price",
          priceHistory: {
            $slice: ["$priceHistory", days],
          },
        },
      },

      {
        $sort: { arrival_date: -1 },
      },
    ]);

    const commoditiesWithTrend = commodities.map((commodity) => {
      const history = commodity.priceHistory;
      let prev = null;

      const priceHistoryWithTrend = history.map((item) => {
        let trend = "same";
        if (!prev !== null) {
          if (item.modal_price > prev) {
            trend = "up";
          } else if (item.modal_price < prev) {
            trend = "down";
          }
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
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const fetchAndStoreDataForCron = async () => {
  try {
    const records = await fetchAllGovData();

    if (!records.length) return false;

    const today = new Date();

    const todayStr =
      String(today.getUTCDate()).padStart(2, "0") +
      "/" +
      String(today.getUTCMonth() + 1).padStart(2, "0") +
      "/" +
      today.getUTCFullYear();

    const todayRecords = records.filter((r) => r.arrival_date === todayStr);

    if (!todayRecords.length) return false;

    const bulkOps = todayRecords.map((item) => {
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

    await Commodity.bulkWrite(bulkOps);

    console.log(`Cron updated ${todayRecords.length} records`);

    return true;
  } catch (err) {
    console.error("Cron error:", err.message);

    return false;
  }
};
