import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
      <header>
        <div className="h-screen flex justify-center">
          <div className="flex flex-col gap-6 justify-center items-center">
            <h1 className="text-5xl lg:text-8xl">Saral Rates</h1>

            <div className="text-center px-15 text-lg lg:px-60">
              <p className="lg:text-2xl">
                Saral Rates is a price tracker of commodities like Vegetables
                and other things. It represents complex government data with
                simple visuals and graphs and all other cool things. It's free
                and anybody can use it (as it is government data) even for
                commercial purposes!
              </p>
              <p className="italic text-sm mt-2 lg:text-xl">
                This data is only valid for India*
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-2 rounded-full bg-black text-white cursor-pointer active:scale-95 transition-all hover:bg-[#000000ce]"
            >
              Try
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Home;
