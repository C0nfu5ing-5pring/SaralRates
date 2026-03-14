import { Store, MapPin, Bookmark, Share } from "lucide-react";
import PriceWithTooltip from "./PriceWithTooltip";
import { useState, useRef } from "react";
import { motion } from "motion/react";

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

  return (
    <motion.div
      ref={cardRef}
      onClick={() => setIsFlipped((v) => !v)}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.5 }}
      className="price-card relative w-full bg-white rounded-2xl border-2 border-gray-300 p-4 cursor-pointer"
      style={{ transformStyle: "preserve-3d", perspective: 1000 }}
    >
      <div
        className="flex flex-col gap-1"
        style={{ backfaceVisibility: "hidden" }}
      >
        <p className="font-semibold line-clamp-2">{card.commodity}</p>
        <p className="text-xs text-gray-600">Variety: {card.variety}</p>

        <PriceWithTooltip
          modalPrice={card.modal_price}
          previousModalPrice={card.previousModalPrice}
        />

        <p className="text-xs">
          <span className="font-black text-base">
            {intl.format(card.modal_price / 100)}
          </span>{" "}
          <span className="font-light">per kilogram</span>
        </p>

        <p className="text-xs">
          {intl.format(card.min_price)} - {intl.format(card.max_price)}
        </p>

        <p className="text-xs flex items-center gap-1">
          <Store size={12} /> {card.market}
        </p>

        <p className="text-xs flex items-center gap-1">
          <MapPin size={12} /> {card.district}, {card.state}
        </p>

        <div className="flex justify-between text-xs border-t pt-1">
          <span>{card.grade}</span>
          <span>{new Date(card.arrival_date).toLocaleDateString("en-IN")}</span>
        </div>
      </div>

      <div
        className="card-back absolute inset-0 flex items-center justify-center gap-4"
        style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(card);
          }}
        >
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
    </motion.div>
  );
}
