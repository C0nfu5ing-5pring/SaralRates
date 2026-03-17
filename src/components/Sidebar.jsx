const Sidebar = ({ view, setView, hasPriceHistory }) => {
  const baseBtnClasses = `
    border border-[var(--darker-border)]
    active:scale-95 hover:shadow-md
    shadow-[var(--shadow)]
    transition-all cursor-pointer
    whitespace-nowrap
    w-auto lg:w-full
    py-2 px-3 lg:py-3 lg:px-6
    rounded-2xl
    text-xs md:text-base lg:text-xl text-[var(--text)]
  `;

  const activeClasses =
    "bg-[var(--sidebar-active)] text-white border-[var(--border-darker)]";
  const inactiveClasses =
    "bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--sidebar-active)] hover:text-[var(--sidebar-hover)] hover:border-[var(--darker-border)]";

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
  );
};

export default Sidebar;
