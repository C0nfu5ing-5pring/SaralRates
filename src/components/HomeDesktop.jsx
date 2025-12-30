import { useNavigate } from "react-router-dom";

const HomeDesktop = () => {
  const navigate = useNavigate();

  return (
    <>
      <header>
        <div className="flex justify-center bg-gray-100 flex-col h-screen p-15">
          <div className="flex justify-start items-center gap-60">
            <h1 className="text-[150px] lg:text-[250px] font-bold">Saral</h1>
            <p className="text-xl lg:text-3xl text-center h-full flex justify-center items-center thin">
              Saral Rates showcases complex government data of daily-commodities
              in a simpler form so that people can also understand.
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-black text-white w-fit mx-auto px-6 py-3 rounded-full text-3xl cursor-pointer hover:bg-[#000000ce] active:scale-95 transition-all"
          >
            Try
          </button>

          <div className="flex items-center justify-end gap-60">
            <p className="text-xl lg:text-3xl text-center h-full flex justify-center items-center thin">
              It is free! (as it is government data) Even for commercial
              purposes. It is only valid for India.{" "}
            </p>
            <h1 className="text-[150px] lg:text-[250px] font-bold">Rates</h1>
          </div>
        </div>
      </header>
    </>
  );
};

export default HomeDesktop;
