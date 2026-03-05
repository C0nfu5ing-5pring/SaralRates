import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toastWithSound } from "../utils/toast.jsx";

export function usePrices(search, view, hasPriceHistory) {
  const [cardArray, setCardArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState(() =>
    JSON.parse(localStorage.getItem("favourites") || "[]"),
  );

  const getToday = () => new Date().toISOString().split("T")[0];

  useEffect(() => {
    const today = getToday();
    const lastFetchDate = localStorage.getItem("lastFetchDate");

    const cachedToday = JSON.parse(
      localStorage.getItem("cachedRecords") || "[]",
    );

    if (lastFetchDate === today && cachedToday.length) {
      setCardArray(cachedToday);
      setLoading(false);
      return;
    }

    const key = import.meta.env.API_KEY;

    axios
      .get(
        "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
        {
          params: {
            "api-key": key,
            format: "json",
            limit: 10000,
          },
        },
      )
      .then((res) => {
        const records = Array.isArray(res.data?.records)
          ? res.data.records
          : [];
        setCardArray(records);
        localStorage.setItem("cachedRecords", JSON.stringify(records));
        localStorage.setItem("lastFetchDate", today);
      })
      .finally(() => setLoading(false));
  }, []);

  const lastPriceMap = useMemo(() => {
    const rawData = JSON.parse(localStorage.getItem("lastPrices") || "[]");
    return new Map(
      rawData.map((product) => [
        `${product.commodity}|${product.market}|${product.district}`,
        product.modal_price,
      ]),
    );
  }, []);

  const enriched = useMemo(() => {
    return cardArray.map((card) => {
      const key = `${card.commodity}|${card.market}|${card.district}`;
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
    const key = `${item.commodity}|${item.market}|${item.district}`;
    return favourites.includes(key);
  };

  const toggleFavourite = (item) => {
    const key = `${item.commodity}|${item.market}|${item.district}`;
    let updated;

    if (favourites.includes(key)) {
      updated = favourites.filter((f) => f !== key);
      toastWithSound(`${item.commodity} removed from favourites`, "info");
    } else {
      updated = [...favourites, key];
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
