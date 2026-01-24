import { Store, MapPin, Info, TriangleAlert } from "lucide-react";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";
import { VirtuosoGrid } from "react-virtuoso";
import { PuffLoader } from "react-spinners";

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
      <p className="flex items-center gap-2 font-semibold text-lg md:text-xl lg:text-2xl">
        {intl.format(modalPrice)}
      </p>

      {previousModalPrice != null && (
        <button
          ref={reference}
          type="button"
          className="
            rounded-full p-1
            text-gray-400 hover:text-gray-700
            hover:bg-gray-100 active:scale-95
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

const Card = ({ search, trendFilter }) => {
  const [cardArray, setCardArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastFetchDate = localStorage.getItem("lastFetchDate");

    if (lastFetchDate === today) {
      const cache = JSON.parse(localStorage.getItem("cachedRecords") || "[]");
      setCardArray(cache);
      setLoading(false);
      return;
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

        localStorage.setItem("cachedRecords", JSON.stringify(records));

        const previousPriceData = res.data.records.map(
          ({
            commodity,
            market,
            district,
            modal_price,
            min_price,
            max_price,
          }) => ({
            commodity,
            market,
            district,
            modal_price,
            min_price,
            max_price,
          }),
        );

        localStorage.setItem("lastPrices", JSON.stringify(previousPriceData));
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

      const matchesTrend = trendFilter === "all" || c.trend === trendFilter;

      return matchesSearch && matchesTrend;
    });
  }, [enriched, search, trendFilter]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center p-10 h-[80vh] items-center">
        <PuffLoader color="#000000" size={120} />

        <p className="text-gray-500 text-lg sm:text-2xl animate-pulse">
          Fetching mandi prices. Please wait.
        </p>
      </div>
    );
  }

  if (!filtered.length) {
    return (
      <div className="flex flex-col justify-center p-10 h-[80vh] items-center">
        <TriangleAlert size={120} style={{ color: "red" }} />
        <p className="text-gray-500 text-lg sm:text-4xl">No results found</p>
      </div>
    );
  }

  return (
    <>
      <VirtuosoGrid
        className="h-[68vh] lg:h-[80vh] w-full"
        totalCount={filtered.length}
        listClassName="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 w-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        itemContent={(index) => {
          const card = filtered[index];
          return (
            <div
              key={index}
              className="
     w-full
     cursor-pointer
     bg-white rounded-2xl
     border-2 border-gray-300
     flex flex-col justify-between
     hover:shadow-md hover:-translate-y-0.5
     transition-all duration-200 p-4 sm:p-6 lg:p-7 gap-1
     min-h-[320px]
   "
            >
              <div>
                <div className="flex justify-start items-center">
                  <p className="text-base md:text-lg lg:text-xl font-semibold whitespace-pre-wrap flex items-center">
                    {card.commodity}
                  </p>
                </div>

                <p className="text-[10px] sm:text-xs text-gray-600">
                  <span className="font-semibold text-black">Variety:</span>{" "}
                  {card.variety}
                </p>
              </div>

              <div>
                <PriceWithTooltip
                  modalPrice={card.modal_price}
                  previousModalPrice={card.previousModalPrice}
                  trend={card.trend}
                />
                <p className="text-[10px] text-gray-500">per quintal</p>
                <p className="text-sm md:text-base text-gray-600">
                  ≈ ₹{(card.modal_price / 100).toFixed(2)} / kg
                </p>
              </div>

              <div className="text-[11px] text-gray-600">
                <p className="uppercase tracking-wide text-[9px] text-gray-400 mb-1">
                  Today's Range
                </p>
                <p className="font-medium text-gray-700">
                  {intl.format(card.min_price)} – {intl.format(card.max_price)}
                </p>
              </div>

              <div>
                {card.trend === "up" && (
                  <span className="flex items-center py-0.5 text-[11px] px-3 rounded-full w-fit bg-green-50 text-green-700">
                    ↑ Increase
                  </span>
                )}

                {card.trend === "down" && (
                  <span className="flex items-center py-0.5 text-[11px] px-3 rounded-full w-fit bg-red-50 text-red-700">
                    ↓ Decrease
                  </span>
                )}

                {card.trend === "same" && (
                  <span className="flex items-center py-0.5 text-[11px] px-3 rounded-full w-fit bg-gray-100 text-gray-600">
                    — Stable
                  </span>
                )}

                {card.trend === "new" && (
                  <span className="flex items-center py-0.5 text-[11px] px-3 rounded-full w-fit bg-blue-50 text-blue-700">
                    New
                  </span>
                )}
              </div>

              <div className="text-[11px] sm:text-xs text-gray-700">
                <p className="flex items-center gap-2">
                  <Store className="text-gray-500" size={13} />
                  {card.market}
                </p>
                <p className="flex items-center gap-2 text-gray-600">
                  <MapPin className="text-red-600" size={13} />
                  {card.district}, {card.state}
                </p>
              </div>

              <div className="flex justify-between text-[11px] text-gray-500 pt-2 border-t">
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
