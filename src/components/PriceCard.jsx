import { MapPin, Bookmark, Share } from "lucide-react";
import PriceWithTooltip from "./PriceWithTooltip";
import { useState, useRef } from "react";
import CustomToast from "./CustomToast";
import { bookmarkSound, unBookmarkSound } from "./Sound";
import { toast } from "react-toastify";
import {
  Area,
  AreaChart,
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

  const formattedData = [...card.priceHistory].reverse().map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
  }));

  const cardRef = useRef(null);

  return (
    <>
      <div
        ref={cardRef}
        className="flex bg-[var(--bg)] price-card rounded-xl border-[var(--border)] border-1 p-4 flex-col gap-2 md:gap-3 lg:gap-5 h-[330px] md:h-[335px] lg:h-[340px]"
      >
        <div className="flex justify-between gap-1">
          <div className="flex flex-col">
            <h1
              className="text-base md:text-lg lg:text-xl"
              title={card.commodity}
            >
              {card.commodity.includes("(")
                ? card.commodity.split("(")[0]
                : card.commodity.split("/")[0]}
            </h1>
            <div className="bg-[var(--variety-bg)] w-fit px-2 text-[9px] md:text-xs lg:text-xs text-[var(--variety-text)] rounded-sm">
              <p className="line-clamp-1" title={card.variety}>
                Variety: {card.variety}
              </p>
            </div>
          </div>

          <div className="flex gap-1">
            <Bookmark
              onClick={handleFavourite}
              className={`cursor-pointer active:scale-90 transition-all ${
                isFavourite
                  ? "text-[var(--icon)] fill-[var(--icon)] stroke-[var(--icon)]"
                  : "text-[var(--icon)] fill-none"
              }`}
            />
            <Share
              onClick={(e) => {
                e.stopPropagation();
                onShare(cardRef.current);
              }}
              className="cursor-pointer active:scale-90 transition-all text-(--icon)"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-[8px] md:text-[10px] lg:text-[10px] font-thin">
            MODAL PRICE
          </h1>
          <div className="flex justify-between items-baseline">
            <div className="flex flex-col md:flex-row items-baseline md:gap-2">
              <h1 className="text-2xl md:text-3xl lg:text-3xl">
                {intl.format(card.modal_price).split(".")[0]}
              </h1>
              <p className="font-thin text-[11px] md:text-xs lg:text-sm">
                ≈ {intl.format(card.modal_price / 100).split(".")[0]}/kg
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="h-[70px] ">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={formattedData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--graph)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--graph)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="modal_price"
                  type="basis"
                  stroke="var(--graph)"
                  dot={{}}
                  fill="url(#colorPrice)"
                  activeDot={{
                    r: 5,
                    fill: "var(--graph-dot)",
                  }}
                />
                <XAxis dataKey="date" hide stroke="var(--axis)" />
                <YAxis dataKey="modal_price" hide stroke="var(--axis)" />
                <Tooltip
                  content={<CustomTooltip />}
                  wrapperStyle={{ pointerEvents: "auto" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-1">
            {card.priceHistory
              .slice(0, 5)
              .reverse()
              .map((item, id) => {
                return (
                  <div
                    key={id}
                    className="bg-[var(--variety-bg)] h-10 md:h-11 lg:h-12 py-1 px-0.5 md:py-1.5 md:px-1 rounded-md flex flex-col items-center justify-center gap-0.5"
                  >
                    <span className="text-[8px] md:text-[9px] leading-none text-[var(--variety-text)] font-normal truncate w-full text-center">
                      {new Date(item.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <span className="text-[10px] md:text-[11px] lg:text-xs leading-none text-[var(--variety-text)] font-medium">
                      ₹{(item.modal_price / 1000).toFixed(1)}k
                    </span>
                  </div>
                );
              })}
          </div>
          <hr className="text-[var(--border)] my-2" />
          <div className="flex gap-2">
            <MapPin className="h-[15px] w-fit" />
            <div>
              <h1 className="text-[11px] md:text-xs lg:text-sm">
                {card.market.split("(")[0]}
                {card.market.split(")")[1]}, {card.district}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
