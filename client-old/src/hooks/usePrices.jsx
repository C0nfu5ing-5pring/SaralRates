import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toastWithSound } from "../utils/toast.jsx";

const API_URL = import.meta.env.VITE_API_URL;

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

    try {
      const res = await axios.get(`${API_URL}/api/commodities`, {
        timeout: 15000,
      });

      const records = res.data?.data || [];

      if (!records.length) {
        toastWithSound(
          "New prices not available yet. Showing cached data",
          "info",
        );
        if (cached.length) setCardArray(cached);
        return;
      }

      const sorted = [...records].sort(
        (a, b) => new Date(b.arrival_date) - new Date(a.arrival_date),
      );

      setCardArray(sorted);
      localStorage.setItem("cachedRecords", JSON.stringify(sorted));
    } catch (err) {
      console.error("API fetch error:", err);
      if (cached.length) setCardArray(cached);
      toastWithSound("Live price update failed. Showing cached data.", "info");
    }
  };

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("cachedRecords") || "[]");
    if (cached.length > 0) {
      setCardArray(cached);
    }

    const load = async () => {
      try {
        await fetchPrices();
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return cardArray.filter(
      (c) =>
        c.commodity?.toLowerCase().includes(q) ||
        c.market?.toLowerCase().includes(q) ||
        c.district?.toLowerCase().includes(q) ||
        c.state?.toLowerCase().includes(q),
    );
  }, [cardArray, search]);

  const isFavourite = (item) => {
    const key = getKey(item);
    return favourites.some((f) => f.key === key);
  };

  const toggleFavourite = (item) => {
    const key = getKey(item);
    const exists = favourites.some((f) => f.key === key);
    let updated;

    if (exists) {
      updated = favourites.filter((f) => f.key !== key);
      toastWithSound(`${item.commodity} removed from favourites`, "info");
    } else {
      updated = [...favourites, { key, arrival_date: item.arrival_date }];
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

  return { finalList, loading, favourites, toggleFavourite };
}
