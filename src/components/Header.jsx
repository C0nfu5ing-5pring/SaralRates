import { useState } from "react";

const Header = () => {
  const [search, setSearch] = useState("");

  return (
    <header className="w-full mt-5 px-4 sm:px-6 lg:px-20 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-5.5xl font-semibold">
            Saral Rates
          </h1>

          <button className="lg:hidden text-sm border-2 border-black px-3 py-1 rounded-xl">
            Dark mode
          </button>
        </div>

        <div className="w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commodity or market"
            className="
              w-full
              py-3 px-6
              rounded-xl
              border border-gray-300
              text-sm sm:text-base
              placeholder-gray-400
              focus:outline-none focus:ring-1 focus:ring-black
              transition
            "
          />
        </div>

        <div className="hidden lg:flex justify-end gap-4">
          <button className="border border-gray-300 cursor-pointer bg-white hover:bg-black hover:border-black hover:text-white transition-all active:scale-95 px-4 py-2 rounded-2xl">
            Source Code
          </button>
          <button className="border border-gray-300 cursor-pointer bg-white hover:bg-black hover:border-black hover:text-white transition-all active:scale-95 px-4 py-2 rounded-2xl">
            Dark mode
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
