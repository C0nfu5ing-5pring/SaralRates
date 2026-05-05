const Sidebar = ({ view, setView, hasPriceHistory, favourites }) => {
  const baseBtnClasses = `
  border border-[var(--darker-border)]
  active:scale-95 hover:shadow-md
  shadow-[var(--shadow)]
  text-center
  transition-all cursor-pointer
  py-2 px-3 lg:py-3 lg:px-6
  rounded-2xl
  text-xs md:text-sm lg:text-lg text-[var(--text)]
  flex-shrink-0 lg:w-full
`;
  const baseCardClasses = `
  hidden lg:flex
  border border-[var(--darker-border)] hover:shadow-md
  shadow-[var(--shadow)]
  transition-all cursor-pointer
  w-full
  py-2 px-3 lg:py-3 lg:px-4
  rounded-2xl
  text-xs lg:text-sm text-[var(--text)]
  justify-between items-center
`;

  const activeClasses =
    "bg-[var(--sidebar-active)] text-white border-[var(--border-darker)]";
  const inactiveClasses = "hover:border-[var(--border)] hover:border-2";

  // const lastFetchedDate = localStorage.getItem("lastFetchedDate");

  return (
    <div
      className="
        flex flex-col
        gap-3
        w-full
        overflow-x-auto
        lg:flex lg:flex-col lg:gap-6
        items-center
        p-3
        lg:py-7 lg:px-5
        justify-between
        lg:h-[82.520vh]
        transition-colors duration-300
      "
    >
      <div className="flex md:flex-col justify-center w-full gap-3">
        <button
          onClick={() => setView("all")}
          className={`${baseBtnClasses} ${view === "all" ? activeClasses : inactiveClasses}`}
        >
          Home
        </button>

        <button
          onClick={() => setView("favourites")}
          className={`${baseBtnClasses} ${view === "favourites" ? activeClasses : inactiveClasses}`}
        >
          Favourites
        </button>

        <button
          onClick={() => setView("increase")}
          className={`${baseBtnClasses} ${
            view === "increase" ? activeClasses : inactiveClasses
          }`}
        >
          Increase
        </button>

        <button
          onClick={() => setView("decrease")}
          title={!hasPriceHistory ? "Price history not available yet" : ""}
          className={`${baseBtnClasses} ${
            view === "decrease" ? activeClasses : inactiveClasses
          }`}
        >
          Decrease
        </button>

        {favourites.length > 0 && (
          <>
            <hr className="border-[var(--variety-bg)] w-full hidden lg:block" />
            <p className="hidden lg:block">LATEST BOOKMARKS</p>
            {[...favourites]
              .reverse()
              .slice(0, 3)
              .map((item, id) => {
                return (
                  <div key={id} className={`${baseCardClasses}`}>
                    <div className="flex flex-col">
                      <h1>{item?.item?.commodity}</h1>
                      <p className="text-sm">{item?.item?.district}</p>
                    </div>

                    <p className="text-base text-[var(--icon)]">
                      {(item?.item?.modal_price / 1000).toFixed(1)}k
                    </p>
                  </div>
                );
              })}
          </>
        )}
      </div>

      <div className="w-full hidden lg:flex flex-col gap-2">
        <hr className="border-[var(--variety-bg)] w-full" />
        <div className="flex flex-wrap gap-2 justify-center">
          <div className="text-xs text-center cursor-pointer px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 tracking-wide">
            v0.7.1
          </div>
          <div className="text-xs text-center cursor-pointer px-3 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 tracking-wide">
            Beta
          </div>
          <div className="text-xs text-center cursor-pointer px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 tracking-wide flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Live
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-sm">Source</h1>
            <a
              href="https://www.data.gov.in/resource/current-daily-price-various-commodities-various-markets-mandi"
              target="_blank"
              className="text-[var(--variety-bg)]  text-xs"
            >
              data.gov.in
            </a>
          </div>
          <div className="flex justify-between">
            <h1 className="text-sm">Updated</h1>
            <p className="text-[var(--variety-bg)] text-xs">
              {/* {lastFetchedDate} */}
              05/05/2026
            </p>
          </div>
          <div className="flex flex-col mt-2">
            <p className="text-xs">Indicative prices only.</p>
            <p className="text-xs">Real prices may vary from place to place.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
