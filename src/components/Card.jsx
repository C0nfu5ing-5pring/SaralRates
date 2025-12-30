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

const intl = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const Card = () => {
  return (
    <>
      <div className="flex p-15 justify-center items-center grow">
        <div className="bg-red-50 p-8 rounded-2xl border-2 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <p className="text-lg font-semibold flex items-center gap-2">
              <Leaf size={18} className="text-gray-600" />
              Cowpea (Lobia / Karamani)
            </p>
            <p className="text-sm text-gray-600">Variety: Cowpea (Whole)</p>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-4xl font-bold flex items-center gap-1">
              <HandCoins size={28} />
              {intl.format(6132)}
            </p>

            <p className="text-sm text-gray-500">per quintal</p>

            <p className="text-sm text-gray-600 flex items-center gap-1">
              ≈ <HandCoins size={14} />
              {(6132 / 100).toFixed(2)} / kg
            </p>
          </div>

          <div className="flex justify-between text-sm">
            <p className="flex items-center gap-1 text-gray-600">
              <ArrowDown size={16} />
              Min <span className="font-medium">{intl.format(400)}</span>
            </p>
            <p className="flex items-center gap-1 text-gray-600">
              <ArrowUp size={16} />
              Max <span className="font-medium">{intl.format(14000)}</span>
            </p>
          </div>

          <div className="text-sm text-gray-700 flex flex-col gap-1">
            <p className="flex items-center gap-2">
              <Store size={16} />
              Kottur APMC
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <MapPin size={16} />
              Bellary, Karnataka
            </p>
          </div>

          <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
            <p className="flex items-center gap-1">
              <Tag size={14} />
              Grade: Local
            </p>
            <p className="flex items-center gap-1">
              <Calendar size={14} />
              30 Dec 2025
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Card;
