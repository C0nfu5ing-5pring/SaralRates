import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toastWithSound } from "../utils/toast.jsx";

export function usePrices(search, view, hasPriceHistory) {
  const [cardArray, setCardArray] = useState([]);
  const [loading, setLoading] = useState(true);

  const [favourites, setFavourites] = useState(() =>
    JSON.parse(localStorage.getItem("favourites") || "[]"),
  );

  const getKey = (item) =>
    `${item.commodity?.trim().toLowerCase()}|${item.market?.trim().toLowerCase()}|${item.district?.trim().toLowerCase()}`;

  const fetchPrices = async () => {
    const cached = JSON.parse(localStorage.getItem("cachedRecords") || "[]");
    const todayStr = new Date().toISOString().split("T")[0];

    try {
      const res = await axios.get("http://localhost:5050/api/commodities");
      const records = res.data?.data || [];

      if (!records.length) {
        toastWithSound(
          "New prices not available yet. Showing cached data",
          "info",
        );
        setCardArray(cached);
        return false;
      }

      const latestRecordDate = new Date(
        Math.max(...records.map((r) => new Date(r.arrival_date))),
      );
      const latestDateStr = latestRecordDate.toISOString().split("T")[0];

      if (latestDateStr === todayStr) {
        const apiMap = new Map();
        records.forEach((record) => apiMap.set(getKey(record), record));

        const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
        favs.forEach((fav) => {
          if (!apiMap.has(fav.key)) {
            const oldRecord = records.find((r) => getKey(r) === fav.key);
            if (oldRecord) apiMap.set(fav.key, oldRecord);
          }
        });

        const mergedRecords = Array.from(apiMap.values());
        setCardArray(mergedRecords);
        localStorage.setItem("cachedRecords", JSON.stringify(mergedRecords));
        localStorage.setItem("lastFetchedDate", todayStr);
        return true;
      }

      toastWithSound(
        "New prices not available yet. Showing cached data",
        "info",
      );
      setCardArray(cached);
      return false;
    } catch (err) {
      console.error("API fetch error:", err);
      setCardArray(cached);
      toastWithSound("Live price update failed. Showing cached data.", "info");
      return false;
    }
  };

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("cachedRecords") || "[]");
    if (cached.length > 0) {
      setCardArray(cached);
      setLoading(false);
    }

    const now = new Date();
    const sixAM = new Date();
    sixAM.setHours(6, 0, 0, 0);

    let intervalId = null;

    const startPolling = async () => {
      const done = await fetchPrices();
      if (!done) {
        intervalId = setInterval(
          async () => {
            const fetched = await fetchPrices();
            if (fetched && intervalId) {
              clearInterval(intervalId);
            }
          },
          5 * 60 * 1000,
        );
      }
      setLoading(false);
    };

    if (now >= sixAM) startPolling();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  const lastPriceMap = useMemo(() => {
    const rawData = JSON.parse(localStorage.getItem("lastPrices") || "[]");
    return new Map(
      rawData.map((product) => [
        `${product.commodity?.trim().toLowerCase()}|${product.market?.trim().toLowerCase()}|${product.district?.trim().toLowerCase()}`,
        product.modal_price,
      ]),
    );
  }, []);

  const enriched = useMemo(() => {
    return cardArray.map((card) => {
      const key = getKey(card);
      const prev = lastPriceMap.get(key);
      let trend = "new";

      if (prev != null) {
        if (card.modal_price > prev) trend = "up";
        else if (card.modal_price < prev) trend = "down";
        else trend = "same";
      }

      return {
        ...card,
        trend,
        previousModalPrice: prev ?? null,
      };
    });
  }, [cardArray, lastPriceMap]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter(
      (c) =>
        c.commodity?.toLowerCase().includes(q) ||
        c.market?.toLowerCase().includes(q) ||
        c.district?.toLowerCase().includes(q) ||
        c.state?.toLowerCase().includes(q),
    );
  }, [enriched, search]);

  const isFavourite = (item) => {
    const key = getKey(item);
    return favourites.some((f) => f.key === key);
  };

  const toggleFavourite = (item) => {
    const key = getKey(item);
    let updated;
    const exists = favourites.some((f) => f.key === key);

    if (exists) {
      updated = favourites.filter((f) => f.key !== key);
      toastWithSound(`${item.commodity} removed from favourites`, "info");
    } else {
      updated = [
        ...favourites,
        {
          key,
          arrival_date: item.arrival_date,
        },
      ];
      toastWithSound(`${item.commodity} added to favourites`, "success");
    }

    setFavourites(updated);
    localStorage.setItem("favourites", JSON.stringify(updated));
  };

  const finalList = useMemo(() => {
    switch (view) {
      case "favourites":
        return filtered.filter((c) => isFavourite(c));

      case "increase":
        if (!hasPriceHistory) return [];
        return filtered.filter((c) => c.trend === "up");

      case "decrease":
        if (!hasPriceHistory) return [];
        return filtered.filter((c) => c.trend === "down");

      default:
        return filtered;
    }
  }, [filtered, view, favourites, hasPriceHistory]);

  return {
    finalList,
    loading,
    favourites,
    toggleFavourite,
  };
}
