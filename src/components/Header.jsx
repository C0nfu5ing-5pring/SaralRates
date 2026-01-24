const Header = ({ search, setSearch }) => {
  return (
    <header className="w-full mt-5 px-4 sm:px-6 lg:px-20 py-6 bg-white  text-black transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold">
            <span className="logo text-5xl sm:text-6xl lg:text-7xl">ljy</span>{" "}
            Rates
          </h1>

          <a
            href="https://www.github.com/C0nfu5ing-5pring/SaralRates"
            target="_blank"
            className="lg:hidden text-sm border border-gray-300  px-3 py-1 rounded-xl bg-white  text-black transition-colors duration-300"
          >
            Source Code
          </a>
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
              bg-white 
              text-black
              text-sm sm:text-base
              placeholder-gray-400 
              focus:outline-none focus:ring-1 focus:ring-black 
              transition
            "
          />
        </div>

        <div className="hidden lg:flex justify-end gap-4">
          <a
            href="https://www.github.com/C0nfu5ing-5pring/SaralRates"
            target="_blank"
            className="border border-gray-300 cursor-pointer bg-white  hover:bg-black hover:text-white transition-all active:scale-95 px-4 py-2 rounded-2xl text-black"
          >
            Source Code
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
