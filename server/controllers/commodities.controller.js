import axios from "axios";
import { db } from "../db/mysql.js";

const API_KEY = process.env.API_KEY;
const LOCK_NAME = "gov_data_sync";

const BASE_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const fetchGovData = async (fromDate = null) => {
  const limit = 10000;
  let offset = 0;
  const allRecords = [];

  const dateFilter = fromDate ? `&filters[arrival_date>=]=${fromDate}` : "";

  while (true) {
    const url =
      `${BASE_URL}?api-key=${API_KEY}` +
      `&format=json&limit=${limit}&offset=${offset}` +
      dateFilter;

    const { data } = await axios.get(url);
    const records = data?.records;

    if (!Array.isArray(records) || records.length === 0) break;

    allRecords.push(...records);

    if (records.length < limit) break;

    offset += limit;
  }

  return allRecords;
};

const acquireLock = async () => {
  const [result] = await db.query(
    `UPDATE cron_locks
     SET locked = 1
     WHERE name = ?
       AND locked = 0`,
    [LOCK_NAME],
  );

  return result.affectedRows === 1;
};

const releaseLock = async (success = true) => {
  await db.query(
    `UPDATE cron_locks
     SET locked = 0,
         last_run = NOW()
     WHERE name = ?`,
    [LOCK_NAME],
  );
};

const slugify = (str = "") =>
  str.toString().trim().toLowerCase().replace(/\s+/g, "-");

const getOrCreateCommodity = async (name, cache) => {
  if (cache.has(name)) return cache.get(name);

  const [rows] = await db.query(
    "SELECT id FROM commodities WHERE name = ? LIMIT 1",
    [name],
  );

  if (rows.length) {
    cache.set(name, rows[0].id);
    return rows[0].id;
  }

  const [result] = await db.query(
    "INSERT INTO commodities (name, slug) VALUES (?, ?)",
    [name, slugify(name)],
  );

  cache.set(name, result.insertId);
  return result.insertId;
};

const getOrCreateMarket = async (name, district, state, cache) => {
  const key = `${name}-${district}-${state}`;

  if (cache.has(key)) return cache.get(key);

  const [rows] = await db.query(
    `SELECT id FROM markets
     WHERE name = ? AND district = ? AND state = ?
     LIMIT 1`,
    [name, district, state],
  );

  if (rows.length) {
    cache.set(key, rows[0].id);
    return rows[0].id;
  }

  const [result] = await db.query(
    `INSERT INTO markets (name, slug, district, state)
     VALUES (?, ?, ?, ?)`,
    [name, slugify(name), district, state],
  );

  cache.set(key, result.insertId);
  return result.insertId;
};

const getOrCreateVariety = async (commodityId, name, grade, cache) => {
  const key = `${commodityId}-${name}-${grade}`;

  if (cache.has(key)) return cache.get(key);

  const [rows] = await db.query(
    `SELECT id FROM varieties
     WHERE commodity_id = ? AND name = ? AND grade = ?
     LIMIT 1`,
    [commodityId, name, grade],
  );

  if (rows.length) {
    cache.set(key, rows[0].id);
    return rows[0].id;
  }

  const [result] = await db.query(
    `INSERT INTO varieties (commodity_id, name, grade, slug)
     VALUES (?, ?, ?, ?)`,
    [commodityId, name, grade, slugify(name)],
  );

  cache.set(key, result.insertId);
  return result.insertId;
};

const fetchAndStore = async (fromDate = null) => {
  const records = await fetchGovData(fromDate);

  let processed = 0;

  const commodityCache = new Map();
  const marketCache = new Map();
  const varietyCache = new Map();

  for (const item of records) {
    const commodityName = item.commodity?.trim();
    const marketName = item.market?.trim();
    const district = item.district?.trim();
    const state = item.state?.trim();

    const varietyName = item.variety?.trim() || "Unknown";
    const grade = item.grade?.trim() || "";
    const arrivalRaw = item.arrival_date;

    if (!commodityName || !marketName || !arrivalRaw) continue;

    const parts = arrivalRaw.split("/");
    if (parts.length !== 3) continue;

    const [day, month, year] = parts;
    const arrivalDate = `${year}-${month}-${day}`;

    const commodityId = await getOrCreateCommodity(
      commodityName,
      commodityCache,
    );

    const marketId = await getOrCreateMarket(
      marketName,
      district,
      state,
      marketCache,
    );

    const varietyId = await getOrCreateVariety(
      commodityId,
      varietyName,
      grade,
      varietyCache,
    );

    await db.query(
      `INSERT IGNORE INTO prices
       (variety_id, market_id, arrival_date, min_price, max_price, modal_price)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        varietyId,
        marketId,
        arrivalDate,
        Number(item.min_price) || 0,
        Number(item.max_price) || 0,
        Number(item.modal_price) || 0,
      ],
    );

    processed++;
  }

  return processed;
};

export const fetchAndStoreData = async (req, res) => {
  try {
    const count = await fetchAndStore();

    return res.json({
      success: true,
      message: `Processed ${count} records`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getLastSyncDate = async () => {
  const [rows] = await db.query(
    `SELECT last_run FROM cron_locks WHERE name = ?`,
    [LOCK_NAME],
  );

  return rows[0]?.last_run || null;
};

export const fetchAndStoreDataForCron = async () => {
  const locked = await acquireLock();

  if (!locked) {
    console.log("[CRON] Already running. Skipping.");
    return { success: false, reason: "locked" };
  }

  try {
    const lastRun = await getLastSyncDate();

    const count = await fetchAndStore(lastRun);

    console.log(`[CRON] Success - ${count} records processed`);

    return { success: true, count };
  } catch (err) {
    console.error("[CRON ERROR]", err.message);

    return { success: false, error: err.message };
  } finally {
    await releaseLock();
  }
};

export const getCommodities = async (req, res) => {
  try {
    const days = 7;

    const [[latest]] = await db.query(`
      SELECT MAX(arrival_date) AS latest_date
      FROM prices
    `);

    if (!latest?.latest_date) {
      return res.json({
        success: true,
        count: 0,
        data: [],
      });
    }

    const [prices] = await db.query(
      `
      SELECT
        c.name AS commodity,
        p.arrival_date,
        m.name AS market,
        m.district,
        m.state,
        v.name AS variety,
        v.grade,
        p.min_price,
        p.max_price,
        p.modal_price
      FROM prices p
      JOIN varieties v ON p.variety_id = v.id
      JOIN commodities c ON v.commodity_id = c.id
      JOIN markets m ON p.market_id = m.id
      WHERE p.arrival_date >= DATE_SUB(?, INTERVAL ? DAY)
      ORDER BY c.name, m.state, m.district, m.name, p.arrival_date DESC
      `,
      [latest.latest_date, days - 1],
    );

    const grouped = new Map();

    for (const row of prices) {
      const key = `${row.commodity}|${row.state}|${row.district}|${row.market}`;

      if (!grouped.has(key)) {
        grouped.set(key, {
          commodity: row.commodity,
          state: row.state,
          district: row.district,
          market: row.market,
          history: [],
        });
      }

      grouped.get(key).history.push({
        date: row.arrival_date,
        variety: row.variety,
        grade: row.grade,
        min_price: row.min_price,
        max_price: row.max_price,
        modal_price: row.modal_price,
      });
    }

    const result = Array.from(grouped.values()).map((item) => ({
      ...item,
      history: item.history
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, days),
    }));

    return res.json({
      success: true,
      count: result.length,
      latest_date: latest.latest_date,
      data: result,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
