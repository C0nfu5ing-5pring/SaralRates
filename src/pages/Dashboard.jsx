import { useState } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [trendFilter, setTrendFilter] = useState("all");

  return (
    <>
      <div className="flex flex-col">
        <Header />

        <div
          className="w-full
px-4 sm:px-6 lg:px-20 lg:flex gap-6"
        >
          <div className="w-full lg:w-[20%] lg:h-[84vh]">
            <div className="flex justify-center lg:flex-col lg:gap-5">
              <div className="border-gray-300 border-2 w-full rounded-3xl">
                <Sidebar />
              </div>
            </div>
          </div>
          <div className="mx-auto lg:w-[80%] border-gray-300 h-[68vh] p-3  lg:h-[83vh] mt-5 lg:mt-0 border-2 rounded-3xl px-5 overflow-hidden">
            <Card search={search} trendFilter={trendFilter} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
