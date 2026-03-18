const Sidebar = ({ view, setView, hasPriceHistory }) => {
  const baseBtnClasses = `
    border border-[var(--darker-border)]
    active:scale-95 hover:shadow-md
    shadow-[var(--shadow)]
    text-center
    md:text-start
    transition-all cursor-pointer
    whitespace-nowrap lg:w-full
    py-2 px-3 lg:py-3 lg:px-6
    rounded-2xl
    text-xs md:text-base lg:text-xl text-[var(--text)]
  `;

  const activeClasses =
    "bg-[var(--sidebar-active)] text-white border-[var(--border-darker)]";
  const inactiveClasses = "hover:border-[var(--border)] hover:border-2";

  const lastFetchedDate = localStorage.getItem("lastFetchedDate");

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
      </div>

      <div className="w-full hidden  lg:flex flex-col gap-2">
        <hr className="border-[var(--variety-bg)] w-full" />
        <div className="flex justify-start gap-3">
          <div className="border-[var(--variety-bg)] text-xs md:text-sm cursor-pointer border hover:border-2 transition-all px-3 py-1 rounded-lg">
            v0.5.0
          </div>
          <div className="border-[var(--variety-bg)] text-xs md:text-sm cursor-pointer border hover:border-2 transition-all px-3 py-1 rounded-lg">
            Alpha
          </div>
          <div className="border-[var(--variety-bg)] text-xs md:text-sm cursor-pointer border hover:border-2 transition-all px-3 py-1 rounded-lg">
            Live
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h1 className="text-sm md:text-base">Source</h1>
            <p className="text-[var(--variety-bg)]  text-xs md:text-base">
              data.gov.in
            </p>
          </div>
          <div className="flex justify-between">
            <h1 className="text-sm md:text-base">Updated</h1>
            <p className="text-[var(--variety-bg)] text-xs md:text-base">
              {lastFetchedDate}
            </p>
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs">
              Indicative prices only. Real prices may vary from place to place
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
