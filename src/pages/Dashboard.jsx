import { useState } from "react";
import Card from "../components/Card";

const Dashboard = () => {
  const [search, setSearch] = useState("");

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

      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <Card search={search} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
