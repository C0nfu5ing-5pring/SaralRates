import CardGrid from "./CardGrid";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";
import { useEffect, useState } from "react";
import CompareBar from "./CompareBar";
import CompareModal from "./CompareModal";

export default function Card({
  search,
  view,
  data,
  favourites,
  setFavourites,
}) {
  const [finalList, setFinalList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  useEffect(() => {
    const savedFavourites = JSON.parse(
      localStorage.getItem("favourites") || "[]",
    );

    const normalized = savedFavourites
      .map((f) => {
        if (typeof f.key === "string") return f;
        if (f.item) {
          const item = f.item;
          const key = `${item.commodity}|${item.market}|${item.district}`
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
          return { key, item };
        }
        return null;
      })
      .filter(Boolean);

    setFavourites(normalized);
  }, []);

  const toggleFavourite = (item) => {
    const key = `${item.commodity}|${item.market}|${item.district}`
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    let updatedFavourites;
    let nowFavourite;

    if (favourites.some((f) => f.key === key)) {
      updatedFavourites = favourites.filter((f) => f.key !== key);
      nowFavourite = false;
    } else {
      updatedFavourites = [...favourites, { key, item }];
      nowFavourite = true;
    }

    setFavourites(updatedFavourites);
    localStorage.setItem("favourites", JSON.stringify(updatedFavourites));
    return nowFavourite;
  };

  useEffect(() => {
    if (!data) {
      return;
    }

    const filtered = data
      .map((item) => {
        const today = item.priceHistory[0];
        const yesterday = item.priceHistory[1];

        let trend = "same";
        let priceChange = 0;

        if (today && yesterday) {
          priceChange = today.modal_price - yesterday.modal_price;

          if (priceChange > 0) {
            trend = "increase";
          } else if (priceChange < 0) {
            trend = "decrease";
          }
        }
        return { ...item, trend, priceChange };
      })
      .filter((item) => {
        return item.commodity.toLowerCase().includes(search.toLowerCase());
      })
      .filter((item) => {
        if (view === "increase") {
          return item.trend === "increase";
        }
        if (view === "decrease") {
          return item.trend === "decrease";
        }
        if (view === "favourites") {
          const key = `${item.commodity}|${item.market}|${item.district}`
            .toLowerCase()
            .replace(/\s+/g, " ")
            .trim();
          return favourites.some((f) => f.key === key);
        }
        return true;
      });

    setFinalList(filtered);
    setLoading(false);
  }, [data, search, view, favourites]);

  const isFavourite = (item) => {
    const key = `${item.commodity}|${item.market}|${item.district}`
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
    return favourites.some((f) => f.key === key);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!finalList.length) {
    return <EmptyState view={view} />;
  }

  const toggleCompare = (item) => {
    setCompareList((prev) => {
      const exists = prev.find(
        (c) => c.commodity === item.commodity && c.market === item.market,
      );
      if (exists) {
        return prev.filter((c) => c !== exists);
      }
      if (prev.length === 1) {
        setShowCompareModal(true);
        return [...prev, item];
      }
      return [item];
    });
  };

  return (
    <>
      {showCompareModal && compareList.length === 2 && (
        <CompareModal
          items={compareList}
          onClose={() => {
            setShowCompareModal(false);
            setCompareList([]);
          }}
        />
      )}
      {compareList.length === 1 && (
        <CompareBar item={compareList[0]} onCancel={() => setCompareList([])} />
      )}
      <CardGrid
        list={finalList}
        favourites={favourites}
        toggleFavourite={toggleFavourite}
        isFavourite={isFavourite}
        compareList={compareList}
        toggleCompare={toggleCompare}
      />
    </>
  );
}
