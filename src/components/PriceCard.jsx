import { Store, MapPin, Bookmark, Share, EllipsisVertical } from "lucide-react";
import PriceWithTooltip from "./PriceWithTooltip";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import CustomToast from "./CustomToast";
import { bookmarkSound, unBookmarkSound } from "./Sound";
import { toast } from "react-toastify";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

const intl = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default function PriceCard({
  card,
  toggleFavourite,
  onShare,
  isFavourite,
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  const handleFavourite = (e) => {
    e.stopPropagation();
    const willBeFavourite = toggleFavourite(card);

    if (willBeFavourite) {
      bookmarkSound.play();
      toast(<CustomToast msg="Item added to favourites" type="success" />, {});
    } else {
      unBookmarkSound.play();
      toast(<CustomToast msg="Item removed from favourites" type="info" />, {});
    }
  };

  const [openModal, setOpenModal] = useState(false);

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const formattedData = [...card.priceHistory].reverse().map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  }));

  return (
    <motion.div
      ref={cardRef}
      onClick={() => setIsFlipped((v) => !v)}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.5 }}
      className="price-card relative w-full bg-[var(--card)] rounded-2xl border-2 border-[var(--border)] p-4 cursor-pointer"
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      <div
        className="flex flex-col gap-[2px]"
        style={{ backfaceVisibility: "hidden" }}
      >
        <EllipsisVertical
          className="absolute right-1 text-[var(--card-dot)]"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpenModal(true);
          }}
        />

        {openModal && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpenModal(false)}
          >
            <div
              className="bg-[var(--card)] rounded-xl py-3 w-full h-full flex flex-col gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full">
                <ResponsiveContainer className="w-full">
                  <LineChart
                    data={formattedData}
                    className="text-xs outline-0"
                    responsive
                  >
                    <XAxis
                      dataKey="date"
                      niceTicks="snap125"
                      stroke="var(--graph-axis)"
                    />
                    <YAxis
                      dataKey="modal_price"
                      niceTicks="snap125"
                      stroke="var(--graph-axis)"
                    />
                    <Line
                      dataKey="modal_price"
                      type="monotone"
                      stroke="var(--graph)"
                      activeDot={{
                        r: 5,
                        color: "var(--graph-dot)",
                      }}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      wrapperStyle={{ pointerEvents: "auto" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <button
                className="bg-[var(--card)] text-[var(--text)] border-2 text-xs lg:text-base border-[var(--border)] w-fit px-3 py-1 mx-auto rounded-xl active:scale-90 transition-all cursor-pointer hover:bg-[var(--bg)] hover:text-[var(--text)]"
                onClick={() => setOpenModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <p className="font-semibold line-clamp-2 text-[var(--commodity)]">
          {card.commodity}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          Variety: {card.variety}
        </p>

        <PriceWithTooltip
          className="text-2xl text-[var(--commodity)]"
          price={intl.format(card.modal_price)}
          trend={card.trend}
        />

        <p className="text-xs">
          <span className="font-black text-base text-[var(--text-muted)]">
            {intl.format(card.modal_price / 100)}
          </span>{" "}
          <span className="font-light text-[var(--text-muted)]">
            per kilogram
          </span>
        </p>

        <p className="text-xs text-[var(--price-min-max)]">
          {intl.format(card.min_price)} - {intl.format(card.max_price)}
        </p>

        <p className="text-xs flex items-center gap-1">
          <Store className="hidden lg:block text-[var(--location)]" size={10} />{" "}
          {card.market}
        </p>

        <p className="text-xs flex items-center gap-1">
          <MapPin
            className="hidden lg:block text-[var(--location)]"
            size={10}
          />{" "}
          {card.district}, {card.state}
        </p>

        <div className="flex justify-between text-xs border-t pt-1 text-[var(--text-muted)]">
          <span>{card.grade}</span>
          <span>{new Date(card.arrival_date).toLocaleDateString("en-IN")}</span>
        </div>
      </div>

      <div
        className="card-back absolute inset-0 flex flex-col px-3 py-4"
        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
      >
        <div>
          <p className="font-semibold line-clamp-2 py-1 text-[var(--commodity)]">
            Previous prices
          </p>
          <hr className="text-[var(--text-muted)]" />
        </div>

        <div className="flex justify-between font-semibold text-[var(--commodity)]">
          <p>Date</p>
          <p>Price</p>
        </div>

        {card.priceHistory.slice(0, 6).map((item, id) => {
          return (
            <div key={id} className="flex justify-between">
              <div className="flex flex-col text-xs lg:text-sm text-[var(--sidebar-inactive-text)]">
                {item.date.split("T")[0]}
              </div>
              <div className="flex flex-col text-xs lg:text-sm text-[var(--sidebar-inactive-text)]">
                ₹{item.modal_price}
              </div>
            </div>
          );
        })}
        <div className="flex w-full justify-center gap-3 fixed bottom-2 right-[2px]">
          <button onClick={handleFavourite}>
            <Bookmark
              size={24}
              className={`transition-all duration-200 cursor-pointer active:scale-90 ${
                isFavourite ? "text-black fill-current" : "text-black fill-none"
              }`}
            />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onShare(cardRef.current);
            }}
          >
            <Share
              size={24}
              className="cursor-pointer active:scale-90 transition-all"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
