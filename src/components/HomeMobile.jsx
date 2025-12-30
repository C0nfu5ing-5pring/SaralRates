import { useNavigate } from "react-router-dom";

const HomeMobile = () => {
  const navigate = useNavigate();
  return (
    <>
      <header className="p-15 h-screen  flex flex-col">
        <div>
          <h1 className="text-8xl text-center leading-20 font-bold">Saral</h1>
          <h1 className="text-8xl text-center leading-20 font-bold">Rates</h1>
        </div>

        <div className="flex justify-center flex-col gap-10 items-center mt-30">
          <p className="text-xl text-center h-full flex justify-center items-center thin">
            Saral Rates showcases complex government data of daily-commodities
            in a simpler form so that people can also understand.
          </p>
          <p className="text-xl text-center h-full flex justify-center items-center thin">
            It is free! (as it is government data) Even for commercial purposes.
            It is only valid for India.{" "}
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-black text-white w-fit mx-auto px-6 py-3 rounded-full text-2xl cursor-pointer hover:bg-[#000000ce] active:scale-95 transition-all"
          >
            Try
          </button>
        </div>
      </header>
    </>
  );
};

export default HomeMobile;
