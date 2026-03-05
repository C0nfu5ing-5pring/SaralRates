import { Store, MapPin, Bookmark, Share } from "lucide-react";
import PriceWithTooltip from "./PriceWithTooltip";

const intl = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default function PriceCard({
  card,
  isFavourite,
  toggleFavourite,
  onShare,
}) {
  return (
    <div className="price-card w-full bg-white rounded-2xl border-2 border-gray-300 p-4 flex flex-col gap-2">
      <div className="flex justify-between">
        <p className="font-semibold line-clamp-2">{card.commodity}</p>
        <div className="flex gap-2">
          <button onClick={() => toggleFavourite(card)}>
            <Bookmark className={isFavourite(card) ? "fill-black" : ""} />
          </button>
          <button onClick={onShare}>
            <Share />
          </button>
        </div>
      </div>

      <p className="text-xs text-gray-600">Variety: {card.variety}</p>

      <PriceWithTooltip
        modalPrice={card.modal_price}
        previousModalPrice={card.previousModalPrice}
      />

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
        <span>{card.arrival_date}</span>
      </div>
    </div>
  );
}
