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

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("cachedRecords") || "[]");
    const lastFetchedDate = localStorage.getItem("lastFetchedDate");

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const nineAM = new Date();
    nineAM.setHours(9, 0, 0, 0);

    const shouldFetch =
      !lastFetchedDate || (now >= nineAM && lastFetchedDate !== todayStr);

    if (!shouldFetch && cached.length > 0) {
      setCardArray(cached);
      setLoading(false);
      return;
    }

    setLoading(true);

    axios
      .get("http://localhost:5050/api/commodities")
      .then((res) => {
        const records = res.data?.data || [];
        if (!records.length) return;

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
      })
      .catch((err) => {
        console.error("API fetch error:", err);
        setCardArray(cached);
        toastWithSound(
          "Live price update failed. Showing cached data.",
          "info",
        );
      })
      .finally(() => setLoading(false));
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
