import { useState } from "react";
import Card from "../components/Card";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [trendFilter, setTrendFilter] = useState("all");

  return (
    <>
      <div
        className="w-full mt-5
px-4 sm:px-6 lg:px-10 py-8 flex flex-col gap-6"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-center">
          Saral Rates
        </h1>
        <div className="px-4 sm:px-6 lg:px-12 py-6 flex flex-col gap-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commodity, market, district.."
            className="
          w-full max-w-lg mx-auto
    py-3 px-6
    rounded-full
    border border-gray-300
    text-sm sm:text-base
    placeholder-gray-400
    focus:outline-none focus:ring-1 focus:ring-black
    transition
        "
          />

          <div className="flex flex-wrap justify-center gap-2">
            {[
              {
                label: "All",
                value: "all",
                active: "bg-black text-white border-black",
              },
              {
                label: "Increase",
                value: "up",
                active: "bg-red-50 text-red-700 border-red-200",
              },
              {
                label: "Decrease",
                value: "down",
                active: "bg-green-50 text-green-700 border-green-200",
              },
              {
                label: "New",
                value: "new",
                active: "bg-blue-50 text-blue-700 border-blue-200",
              },
            ].map((item) => (
              <button
                key={item.value}
                onClick={() => setTrendFilter(item.value)}
                className={`px-4 cursor-pointer py-1.5 rounded-full text-xs font-medium sm:text-sm border transition-all active:scale-95 ${
                  trendFilter === item.value
                    ? item.active
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-5 mt-5">
        <Card search={search} trendFilter={trendFilter} />
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
