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
import { useEffect, useState } from "react";

const intl = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const Card = () => {
  const [cardArray, setCardArray] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastFetchDate = localStorage.getItem("lastFetchDate");

    // if (lastFetchDate === today) {
    //   setLoading(true);
    //   return;
    // }

    axios
      .get(
        "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd00000161044603d2b74a674677081bf7f413a5&format=json&limit=12"
      )
      .then((res) => {
        setCardArray(res.data.records);
        localStorage.setItem("lastFetchDate", today);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="col-span-full flex justify-center items-center min-h-[40vh]">
        <p className="text-gray-500 text-lg sm:text-2xl animate-pulse">
          Fetching mandi prices…
        </p>
      </div>
    );
  }

  return (
    <>
      {Array.isArray(cardArray) &&
        cardArray.map((card, index) => (
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
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-1">
                <HandCoins size={22} />
                {intl.format(card.modal_price)}
              </p>
              <p className="text-xs text-gray-500">per quintal</p>
              <p className="text-xs sm:text-sm text-gray-600">
                ≈ ₹{(card.modal_price / 100).toFixed(2)} / kg
              </p>
            </div>

            <div className="flex justify-between text-xs sm:text-sm text-gray-600">
              <p className="flex items-center gap-1">
                <ArrowDown size={14} />
                {intl.format(card.min_price)}
              </p>
              <p className="flex items-center gap-1">
                <ArrowUp size={14} />
                {intl.format(card.max_price)}
              </p>
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
