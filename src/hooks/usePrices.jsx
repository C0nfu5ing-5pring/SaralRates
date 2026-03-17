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

    const today = new Date();
    const todayStr = today.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    try {
      const todayRes = await axios.get(
        `http://localhost:5050/api/commodities?date=${todayStr}`,
      );

      const prevRes = await axios.get(
        `http://localhost:5050/api/commodities?date=${yesterdayStr}`,
      );

      const todayRecords = todayRes.data?.data || [];
      const prevRecords = prevRes.data?.data || [];

      if (!todayRecords.length && !prevRecords.length) {
        toastWithSound(
          "New prices not available yet. Showing cached data",
          "info",
        );
        setCardArray(cached);
        return;
      }

      const prevMap = new Map();
      prevRecords.forEach((item) => {
        prevMap.set(getKey(item), item);
      });

      const mergedRecords = todayRecords.map((item) => {
        const key = getKey(item);
        const prev = prevMap.get(key);

        let trend = "new";
        let previousModalPrice = null;

        if (prev) {
          previousModalPrice = prev.modal_price;

          if (item.modal_price > prev.modal_price) trend = "up";
          else if (item.modal_price < prev.modal_price) trend = "down";
          else trend = "same";
        }

        return {
          ...item,
          trend,
          previousModalPrice,
        };
      });

      mergedRecords.sort(
        (a, b) => new Date(b.arrival_date) - new Date(a.arrival_date),
      );
      setCardArray(mergedRecords);
      localStorage.setItem("cachedRecords", JSON.stringify(mergedRecords));
      localStorage.setItem("lastFetchedDate", todayStr);

      // const apiMap = new Map();

      // prevRecords.forEach((record) => {
      //   apiMap.set(getKey(record), record);
      // });

      // todayRecords.forEach((record) => {
      //   apiMap.set(getKey(record), record);
      // });

      // const mergedRecords = Array.from(apiMap.values());

      // mergedRecords.sort(
      //   (a, b) => new Date(b.arrival_date) - new Date(a.arrival_date),
      // );

      // setCardArray(mergedRecords);
      // localStorage.setItem("cachedRecords", JSON.stringify(mergedRecords));
      // localStorage.setItem("lastFetchedDate", todayStr);

      // return true;
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
    }

    const load = async () => {
      await fetchPrices();
      setLoading(false);
    };

    load();
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

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return cardArray.filter((c) => {
      c.commodity?.toLowerCase().includes(q) ||
        c.market?.toLowerCase().includes(q) ||
        c.district?.toLowerCase().includes(q) ||
        c.state?.toLowerCase().includes(q);
    });
  }, [cardArray, search]);

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
