import { useState, useEffect } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [commodities, setCommodities] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/commodities");
        const json = await res.json();
        if (json.success) setCommodities(json.data);
      } catch (err) {
        console.log("Failed to fetch commodities", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const dataWithTrend = commodities.map((item) => {
      const today = item.priceHistory[0];
      const yesterday = item.priceHistory[1];

      let trend = "same";
      if (today && yesterday) {
        if (today.modal_price > yesterday.modal_price) {
          trend = "increase";
        } else if (today.modal_price < yesterday.modal_price) {
          trend = "decrease";
        }
      }

      return { ...item, trend };
    });
    setProcessedData(dataWithTrend);
  }, [commodities]);

  return (
    <div className="flex flex-col bg-white text-black transition-colors duration-300">
      <Header search={search} setSearch={setSearch} />

      <div className="w-full px-4 sm:px-6 lg:px-20 lg:flex gap-6">
        <div className="w-full lg:w-[20%] lg:h-[84vh]">
          <div className="flex justify-center lg:flex-col lg:gap-5">
            <div className="border-gray-300 border-2 w-full rounded-3xl bg-white shadow-md">
              <Sidebar view={view} setView={setView} />
            </div>
          </div>
        </div>
        <div className="mx-auto lg:w-[80%] border-gray-300 h-[68vh] p-3 lg:h-[83vh] mt-5 lg:mt-0 border-2 rounded-3xl px-5 overflow-hidden bg-white shadow-xl">
          <Card data={processedData} search={search} view={view} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
