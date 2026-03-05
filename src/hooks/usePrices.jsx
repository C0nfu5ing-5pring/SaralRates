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

    const cachedMap = new Map();

    cached.forEach((record) => {
      cachedMap.set(getKey(record), record);
    });

    if (cached.length > 0) {
      setCardArray(cached);
      setLoading(false);
    }

    const api_key = import.meta.env.VITE_API_KEY;
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${api_key}&format=json&limit=10000`;
    const encodedUrl = encodeURIComponent(url);

    axios
      .get(`https://corsproxy.io/?${encodedUrl}`)
      .then((res) => {
        const records = res.data?.records || [];
        if (records.length === 0) return;

        records.forEach((record) => {
          const key = getKey(record);
          const existing = cachedMap.get(key);

          if (!existing) {
            cachedMap.set(key, record);
            return;
          }

          const newDate = new Date(record.arrival_date);
          const oldDate = new Date(existing.arrival_date);

          if (newDate > oldDate) {
            cachedMap.set(key, record);
          }
        });

        favourites.forEach((fav) => {
          const favKey = fav.key;

          if (!cachedMap.has(favKey)) {
            const oldRecord = cached.find((r) => getKey(r) === favKey);
            if (oldRecord) {
              cachedMap.set(favKey, oldRecord);
            }
          }
        });

        const mergedRecords = Array.from(cachedMap.values());

        setCardArray(mergedRecords);

        localStorage.setItem("cachedRecords", JSON.stringify(mergedRecords));
      })
      .catch(() => {
        toastWithSound(
          "Live price update failed. Showing cached data.",
          "info",
        );
      })
      .finally(() => setLoading(false));
  }, [favourites]);

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
