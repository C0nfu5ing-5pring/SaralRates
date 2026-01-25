import {
  Store,
  MapPin,
  Info,
  TriangleAlert,
  Bookmark,
  Share,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import html2canvas from "html2canvas";
import { VirtuosoGrid } from "react-virtuoso";
import { PuffLoader } from "react-spinners";
import { toastWithSound } from "../utils/toast.jsx";

const intl = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

function PriceWithTooltip({ modalPrice, previousModalPrice }) {
  const [open, setOpen] = useState(false);

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const { x, y, reference, floating, strategy } = useFloating({
    placement: "top",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const openTip = () => setOpen(true);
  const closeTip = () => setOpen(false);
  const toggleTip = () => setOpen((v) => !v);

  return (
    <div className="flex items-center gap-2 relative">
      <p className="flex items-center gap-2 font-semibold text-lg md:text-xl lg:text-2xl text-black">
        {intl.format(modalPrice)}
      </p>

      {previousModalPrice != null && (
        <button
          ref={reference}
          type="button"
          className="
            rounded-full p-1
            text-gray-400  hover:text-gray-700 
            hover:bg-gray-100 
            active:scale-95
            transition
          "
          onMouseEnter={!isTouch ? openTip : undefined}
          onMouseLeave={!isTouch ? closeTip : undefined}
          onClick={isTouch ? toggleTip : undefined}
        >
          <Info className="text-blue-500" size={16} />
        </button>
      )}

      {open && previousModalPrice != null && (
        <>
          {isTouch && <div className="fixed inset-0 z-40" onClick={closeTip} />}

          <div
            ref={floating}
            style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
            className="
              z-50 max-w-56
              rounded-xl bg-gray-900 px-3 py-2
              text-xs text-white shadow-2xl
            "
          >
            <p className="text-gray-400">Previous price</p>
            <p className="font-semibold">{intl.format(previousModalPrice)}</p>

            {isTouch && (
              <p className="mt-1 text-[10px] text-gray-500">
                Tap outside to close
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const Card = ({ search, view, hasPriceHistory }) => {
  const [cardArray, setCardArray] = useState([]);
  const [yesterdayArray, setYesterdayArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favourites, setFavourites] = useState(() => {
    return JSON.parse(localStorage.getItem("favourites") || "[]");
  });

  const getToday = () => new Date().toISOString().split("T")[0];

  const makeKey = (r) => `${r.commodity}|${r.market}|${r.district}`;

  useEffect(() => {
    const today = getToday();
    const lastFetchDate = localStorage.getItem("lastFetchDate");

    const cachedToday = JSON.parse(
      localStorage.getItem("cachedRecords") || "[]",
    );
    const cachedYesterday = JSON.parse(
      localStorage.getItem("yesterdayRecords") || "[]",
    );

    if (lastFetchDate === today && cachedToday.length) {
      setCardArray(cachedToday);
      setYesterdayArray(cachedYesterday);
      setLoading(false);
      return;
    }

    if (cachedToday.length) {
      localStorage.setItem("yesterdayRecords", JSON.stringify(cachedToday));
    }

    axios
      .get(
        "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
        {
          params: {
            "api-key":
              "579b464db66ec23bdd00000161044603d2b74a674677081bf7f413a5",
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
        setYesterdayArray(
          JSON.parse(localStorage.getItem("yesterdayRecords") || "[]"),
        );

        localStorage.setItem("cachedRecords", JSON.stringify(records));
        localStorage.setItem("lastFetchDate", today);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
    const userInput = search.toLowerCase();
    return enriched.filter((c) => {
      const matchesSearch =
        c.commodity?.toLowerCase().includes(userInput) ||
        c.market?.toLowerCase().includes(userInput) ||
        c.district?.toLowerCase().includes(userInput) ||
        c.state?.toLowerCase().includes(userInput);

      return matchesSearch;
    });
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
        return filtered.filter((card) => isFavourite(card));
      case "increase":
        if (!hasPriceHistory) return [];
        return filtered.filter((card) => card.trend === "up");
      case "decrease":
        if (!hasPriceHistory) return [];
        return filtered.filter((card) => card.trend === "down");
      case "all":
      default:
        return filtered;
    }
  }, [filtered, view, favourites, hasPriceHistory]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center p-10 h-[80vh] items-center bg-white transition-colors duration-300">
        <PuffLoader color="gray" size={120} />
        <p className="text-gray-500 text-lg sm:text-2xl animate-pulse">
          Fetching mandi prices. Please wait.
        </p>
      </div>
    );
  }

  if (!finalList.length) {
    return (
      <div className="flex flex-col justify-center p-10 h-[80vh] items-center bg-white transition-colors duration-300">
        <TriangleAlert size={120} style={{ color: "gray" }} />
        <p className="text-gray-500 text-lg sm:text-4xl text-center">
          {view === "favourites"
            ? "No favourites added yet"
            : hasPriceHistory
              ? "No matching records"
              : "Price history not available yet"}
        </p>
      </div>
    );
  }

  const shareCardAsImage = async (element) => {
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      scrollY: 0,
      useCORS: true,
      ignoreElements: (el) => el.tagName === "svg",
      onclone: (doc) => {
        const card = doc.querySelector(".price-card");
        if (!card) return;

        card.style.overflow = "visible";
        card.style.height = "auto";
        card.style.minHeight = "unset";
        card.style.maxHeight = "unset";
        card.style.paddingTop = "24px";

        const titles = card.querySelectorAll(".line-clamp-2");
        titles.forEach((el) => {
          el.style.display = "block";
          el.style.overflow = "visible";
          el.style.WebkitLineClamp = "unset";
          el.style.maxHeight = "none";
        });

        const els = doc.querySelectorAll("*");
        els.forEach((el) => {
          const style = doc.defaultView.getComputedStyle(el);

          if (style.color.includes("oklch")) el.style.color = "#000";
          if (style.backgroundColor.includes("oklch"))
            el.style.backgroundColor = "#fff";
          if (style.borderColor.includes("oklch"))
            el.style.borderColor = "#ddd";
        });
      },
    });

    const image = canvas.toDataURL("image/png");

    const blob = await (await fetch(image)).blob();
    const file = new File([blob], "saral-rate.png", { type: "image/png" });

    if (navigator.share) {
      await navigator.share({
        files: [file],
        title: "Saral Rates",
      });
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(
          "Check this price from Saral Rates",
        )}`,
        "_blank",
      );
    }
  };

  return (
    <>
      <VirtuosoGrid
        className="h-[68vh] lg:h-[80vh] w-full"
        totalCount={finalList.length}
        listClassName="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 w-full"
        itemContent={(index) => {
          const card = finalList[index];
          return (
            <div
              key={index}
              className="
              price-card
                w-full
                bg-white 
                rounded-2xl
                border-2 border-gray-300 
                flex flex-col gap-2
                lg:justify-between
                hover:shadow-md
                transition-all duration-200 p-3 sm:p-6 lg:p-7 lg:gap-1
                 min-h-65
                text-black 
              "
            >
              <div className="relative">
                <div className="flex justify-between items-start gap-1 lg:gap-3">
                  <p className="text-base md:text-lg lg:text-lg font-semibold leading-tight line-clamp-2 pr-1">
                    {card.commodity}
                  </p>

                  <div className="flex flex-col gap-1 lg:gap-2 absolute right-0">
                    <button onClick={() => toggleFavourite(card)}>
                      <Bookmark
                        className={`shrink-0 cursor-pointer active:scale-80 transition-all ${
                          isFavourite(card) ? "fill-black" : "stroke-black"
                        }`}
                      />
                    </button>

                    <button
                      onClick={(e) =>
                        shareCardAsImage(e.currentTarget.closest(".price-card"))
                      }
                    >
                      <Share className="cursor-pointer active:scale-80 transition-all z-50" />
                    </button>
                  </div>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-600 w-fit">
                  <span className="font-semibold text-black ">Variety:</span>{" "}
                  {card.variety}
                </p>
              </div>

              <div>
                <PriceWithTooltip
                  modalPrice={card.modal_price}
                  previousModalPrice={card.previousModalPrice}
                  trend={card.trend}
                />
                <p className="text-[10px] text-gray-500 ">per quintal</p>
                <p className="text-sm md:text-base text-gray-600 ">
                  ≈ ₹{(card.modal_price / 100).toFixed(2)} / kg
                </p>
              </div>

              <div className="text-[11px] text-gray-600 ">
                <p className="uppercase tracking-wide text-[9px] text-gray-400 lg:mb-1">
                  Today's Range
                </p>
                <p className="font-medium text-gray-700 ">
                  {intl.format(card.min_price)} - {intl.format(card.max_price)}
                </p>
              </div>

              <div className="text-[11px] sm:text-xs text-gray-700 ">
                <p className="flex items-center gap-0.5 lg:gap-2">
                  <Store className="text-gray-500 " size={13} />
                  {card.market}
                </p>
                <p className="flex items-center gap-0.5 lg:gap-2 text-gray-600 ">
                  <MapPin className="text-red-600 " size={13} />
                  {card.district}, {card.state}
                </p>
              </div>

              <div className="flex justify-between text-[11px] text-gray-500 pt-0.5 lg:pt-2 border-t border-gray-300 ">
                <p className="flex items-center gap-1">{card.grade}</p>
                <p className="flex items-center gap-1">{card.arrival_date}</p>
              </div>
            </div>
          );
        }}
      />
    </>
  );
};

export default Card;
