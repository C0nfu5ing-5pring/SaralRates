const Sidebar = ({ view, setView, hasPriceHistory }) => {
  const baseBtnClasses = `
    border border-gray-300
    active:scale-95 hover:shadow-md
    transition-all cursor-pointer
    whitespace-nowrap
    w-auto lg:w-full
    py-2 px-3 lg:py-3 lg:px-6
    rounded-2xl
    text-sm sm:text-base lg:text-xl
  `;

  const activeClasses = "bg-black text-white border-black";
  const inactiveClasses =
    "bg-white text-black hover:bg-black hover:text-white hover:border-black";

  return (
    <div
      className="
        flex flex-row
        gap-3
        w-full
        overflow-x-auto
        lg:flex lg:flex-col lg:gap-6
        items-center
        h-full
        p-3
        lg:py-7 lg:px-5
        justify-center
        transition-colors duration-300
      "
    >
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
        onClick={() => hasPriceHistory && setView("increase")}
        disabled={!hasPriceHistory}
        title={!hasPriceHistory ? "Price history not available yet" : ""}
        className={`${baseBtnClasses} ${
          view === "increase" ? activeClasses : inactiveClasses
        } ${!hasPriceHistory ? "opacity-50 cursor-not-allowed hover:none" : ""}`}
      >
        Increase
      </button>

      <button
        onClick={() => hasPriceHistory && setView("decrease")}
        disabled={!hasPriceHistory}
        title={!hasPriceHistory ? "Price history not available yet" : ""}
        className={`${baseBtnClasses} ${
          view === "decrease" ? activeClasses : inactiveClasses
        } ${!hasPriceHistory ? "opacity-50 cursor-not-allowed hover:none" : ""}`}
      >
        Decrease
      </button>
    </div>
  );
};

export default Sidebar;
