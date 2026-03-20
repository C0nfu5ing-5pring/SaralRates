import { useState, useEffect } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import LaunchModal from "../components/LaunchModal";

const Dashboard = ({ cycleTheme }) => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("all");
  const [commodities, setCommodities] = useState([]);
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5050/api/commodities");
        const json = await res.json();
        if (json.success) {
          setCommodities(json.data);
          localStorage.setItem(
            "lastFetchedDate",
            new Date().toLocaleDateString("en-IN"),
          );
        }
      } catch (err) {
        console.log("Failed to fetch commodities", err);
      }
    };
    fetchData();
  }, []);

  const firstVisit = localStorage.getItem("hasVisited");

  return (
    <>
      {firstVisit ? null : <LaunchModal />}

      <div className="flex flex-col bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
        <Header cycleTheme={cycleTheme} search={search} setSearch={setSearch} />

        <div className="w-full px-4 sm:px-6 lg:px-20 lg:flex gap-6">
          <div className="w-full lg:w-[20%] lg:h-[84vh]">
            <div className="flex flex-col gap-3 justify-center lg:flex-col lg:gap-5">
              <div className="border-[var(--border)] border-2 w-full rounded-3xl bg-[var(--view-bg)] shadow-md shadow-[var(--shadow)]">
                <Sidebar
                  view={view}
                  setView={setView}
                  favourites={favourites}
                />
              </div>
            </div>
          </div>
          <div className="mx-auto lg:w-[80%] border-[var(--border)] h-[68vh] p-3 lg:h-[83vh] bg-[var(--view-bg)] mt-5 lg:mt-0 border-2 rounded-3xl px-5 overflow-hidden shadow-xl shadow-[var(--shadow)]">
            <Card
              data={commodities}
              search={search}
              view={view}
              favourites={favourites}
              setFavourites={setFavourites}
            />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Dashboard;
