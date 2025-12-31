import {
  Leaf,
  HandCoins,
  ArrowDown,
  ArrowUp,
  Store,
  MapPin,
  Tag,
  Calendar,
  Info,
} from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

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
      <p className="flex items-center gap-2 font-semibold text-lg sm:text-xl">
        <HandCoins size={22} />
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
          <Info size={16} />
        </button>
      )}

      {open && previousModalPrice != null && (
        <>
          {isTouch && <div className="fixed inset-0 z-40" onClick={closeTip} />}

          <div
            ref={floating}
            style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
            className="
              z-50 max-w-60
              rounded-lg bg-gray-900 px-3 py-2
              text-xs text-white shadow-xl
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

const Card = ({ search }) => {
  const [cardArray, setCardArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios;

    const today = new Date().toISOString().split("T")[0];
    const lastFetchDate = localStorage.getItem("lastFetchDate");

    if (lastFetchDate === today) {
      setLoading(false);
      return;
    }

    axios
      .get(
        "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd00000161044603d2b74a674677081bf7f413a5&format=json&limit=1"
      )
      .then((res) => {
        setCardArray(res.data.records);

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
          })
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

  // localStorage.clear();

  const lastPrices = JSON.parse(localStorage.getItem("lastPrices") || "[]");

  const findLastPrice = (card) => {
    return lastPrices.find((price) => {
      return (
        price.commodity === card.commodity &&
        price.market === card.market &&
        price.district === card.district
      );
    });
  };

  const enrichedCards = cardArray.map((card) => {
    const last = findLastPrice(card);

    if (!last) {
      return {
        ...card,
        modalDifference: 0,
        minDifference: 0,
        maxDifference: 0,
        trend: "new",
        previousModalPrice: null,
      };
    }

    const modalDifference = card.modal_price - last.modal_price;
    const minDifference = card.min_price - last.min_price;
    const maxDifference = card.max_price - last.max_price;

    let trend = "same";

    if (modalDifference > 0) trend = "up";
    else if (modalDifference < 0) trend = "down";

    return {
      ...card,
      modalDifference,
      minDifference,
      maxDifference,
      trend,
      previousModalPrice: last.modal_price,
    };
  });

  const filteredCards = search.trim()
    ? enrichedCards.filter((card) => {
        const userInput = search.toLowerCase();
        return (
          card.commodity?.toLowerCase().includes(userInput) ||
          card.market?.toLowerCase().includes(userInput) ||
          card.district?.toLowerCase().includes(userInput) ||
          card.state?.toLowerCase().includes(userInput)
        );
      })
    : enrichedCards;

  if (loading) {
    return (
      <div className="col-span-full flex justify-center items-center min-h-[40vh]">
        <p className="text-gray-500 text-lg sm:text-2xl animate-pulse">
          Fetching mandi prices…
        </p>
      </div>
    );
  }

  if (!filteredCards.length) {
    return (
      <p className="text-gray-500 text-center col-span-full">
        No results found
      </p>
    );
  }

  return (
    <>
      {Array.isArray(enrichedCards) &&
        filteredCards.map((card, index) => (
          <div
            key={index}
            className="w-full max-w-sm bg-white rounded-2xl border p-4 sm:p-6 lg:p-7 flex flex-col gap-3 sm:gap-4 lg:gap-5"
          >
            <div>
              <p className="text-sm sm:text-base lg:text-lg font-semibold flex items-center gap-2">
                <Leaf size={16} className="text-green-600" />
                {card.commodity}
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Variety: {card.variety}
              </p>
            </div>

            <div>
              <PriceWithTooltip
                modalPrice={card.modal_price}
                previousModalPrice={card.previousModalPrice}
                trend={card.trend}
              />
              <p className="text-xs text-gray-500">per quintal</p>
              <p className="text-xs sm:text-sm text-gray-600">
                ≈ ₹{(card.modal_price / 100).toFixed(2)} / kg
              </p>
            </div>

            <div className="flex justify-between gap-3 text-xs sm:text-sm text-gray-600">
              <p className="flex items-center">
                <ArrowDown size={14} />
                {intl.format(card.min_price)}
              </p>
              <p className="flex items-center">
                <ArrowUp size={14} />
                {intl.format(card.max_price)}
              </p>
            </div>

            <div>
              {card.trend === "up" && (
                <span className="flex items-center py-0.5 text-xs px-3 rounded-full w-fit bg-green-50  text-green-700">
                  ↑ Increase
                </span>
              )}

              {card.trend === "down" && (
                <span className="flex items-center py-0.5 text-xs px-3 rounded-full w-fit bg-red-50  text-red-700">
                  ↓ Decrease
                </span>
              )}

              {card.trend === "same" && (
                <span className="flex items-center py-0.5 text-xs px-3 rounded-full w-fit bg-gray-100  text-gray-600">
                  — Stable
                </span>
              )}

              {card.trend === "new" && (
                <span className="flex items-center py-0.5 text-xs px-3 rounded-full w-fit bg-blue-50  text-blue-700">
                  New
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm text-gray-700">
              <p className="flex items-center gap-2">
                <Store size={14} />
                {card.market}
              </p>
              <p className="flex items-center gap-2 text-gray-600">
                <MapPin size={14} />
                {card.district}, {card.state}
              </p>
            </div>

            <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
              <p className="flex items-center gap-1">
                <Tag size={12} />
                {card.grade}
              </p>
              <p className="flex items-center gap-1">
                <Calendar size={12} />
                {card.arrival_date}
              </p>
            </div>
          </div>
        ))}
    </>
  );
};

export default Card;
