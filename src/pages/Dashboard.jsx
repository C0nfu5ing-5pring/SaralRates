import { useState } from "react";
import Card from "../components/Card";
import { Virtuoso } from "react-virtuoso";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [trendFilter, setTrendFilter] = useState("all");

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search commodity, market, district.."
        className="
          w-full max-w-md mx-auto
          py-2 px-6
          border-2 rounded-full
          text-sm sm:text-base lg:text-lg
          focus:outline-none
        "
      />

      <div className="flex flex-wrap justify-center gap-2">
        {[
          { label: "All", value: "all" },
          { label: "Increase", value: "up" },
          { label: "Decrease", value: "down" },
          { label: "New", value: "new" },
        ].map((item) => (
          <button
            key={item.value}
            onClick={() => setTrendFilter(item.value)}
            className={`px-4 cursor-pointer py-1.5 rounded-full text-xs sm:text-sm border transition ${
              trendFilter === item.value
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full">
        <Card search={search} trendFilter={trendFilter} />
      </div>
    </div>
  );
};

export default Dashboard;
