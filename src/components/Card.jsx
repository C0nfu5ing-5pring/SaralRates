import {
  Leaf,
  HandCoins,
  ArrowDown,
  ArrowUp,
  Store,
  MapPin,
  Tag,
  Calendar,
} from "lucide-react";

import axios from "axios";

const intl = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});
import { useEffect, useState } from "react";

const Card = () => {
  const [cardArray, setCardArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd00000161044603d2b74a674677081bf7f413a5&format=json&limit=5"
      )
      .then((res) => {
        setCardArray(...cardArray, res.data.records);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-gray-500 text-4xl animate-pulse">
          Fetching mandi prices…
        </p>
      </div>
    );
  }

  return (
    <>
      {Array.isArray(cardArray) &&
        cardArray.map((card, index) => {
          return (
            <div
              key={index}
              className="flex p-15 justify-center items-center grow"
            >
              <div className="bg-red-50 p-8 rounded-2xl border-2 flex flex-col gap-6">
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold flex items-center gap-2">
                    <Leaf size={18} className="text-gray-600" />
                    {card.commodity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Variety: {card.variety}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <p className="text-4xl font-bold flex items-center gap-1">
                    <HandCoins size={28} />
                    {intl.format(card.modal_price)}
                  </p>

                  <p className="text-sm text-gray-500">per quintal</p>

                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    ≈ <HandCoins size={14} />
                    {(card.modal_price / 100).toFixed(2)} / kg
                  </p>
                </div>

                <div className="flex justify-between gap-5 text-sm">
                  <p className="flex items-center gap-1 text-gray-600">
                    <ArrowDown size={16} />
                    Min{" "}
                    <span className="font-medium">
                      {intl.format(card.min_price)}
                    </span>
                  </p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <ArrowUp size={16} />
                    Max{" "}
                    <span className="font-medium">
                      {intl.format(card.max_price)}
                    </span>
                  </p>
                </div>

                <div className="text-sm text-gray-700 flex flex-col gap-1">
                  <p className="flex items-center gap-2">
                    <Store size={16} />
                    {card.market}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    {card.district}, {card.state}
                  </p>
                </div>

                <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                  <p className="flex items-center gap-1">
                    <Tag size={14} />
                    Grade: {card.grade}
                  </p>
                  <p className="flex items-center gap-1">
                    <Calendar size={14} />
                    {card.arrival_date}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Card;
