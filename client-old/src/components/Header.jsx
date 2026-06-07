const Header = ({ search, setSearch, cycleTheme }) => {
  return (
    <header className="w-full px-4 sm:px-6 lg:px-12 xl:px-20 py-4 lg:py-5 xl:py-6 bg-[var(--bg)] text-black transition-colors duration-300">
      <div className="flex flex-col gap-3 lg:grid lg:grid-cols-[24%_62%_14%] xl:grid-cols-[20%_66%_14%] lg:items-end lg:gap-3 xl:gap-4">
        <div className="flex justify-between items-center lg:items-end">
          <h1 className="text-3xl sm:text-4xl lg:text-3xl xl:text-5xl font-semibold inline-flex items-end gap-2 text-[var(--logo)]">
            <span className="logo leading-none text-4xl sm:text-5xl lg:text-4xl xl:text-6xl">
              ljy
            </span>
            Rates
          </h1>

          <button
            onClick={cycleTheme}
            className="lg:hidden w-fit text-xs sm:text-sm border border-[var(--darker-border)] px-3 py-1 rounded-xl bg-[var(--bg)] text-[var(--text)] transition-colors duration-300 hover:bg-[var(--logo)] hover:text-[var(--sidebar-active)]"
          >
            Change theme
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
              py-2 px-4 lg:py-2.5 lg:px-5 xl:py-3 xl:px-6
              rounded-xl
              border border-[var(--border)]
              bg-[var(--bg)]
              text-[var(--text)]
              text-sm sm:text-base
              placeholder-[var(--muted-text)]
              focus:outline-none focus:ring-1 focus:ring-[var(--darker-border)]
              transition
            "
          />
        </div>

        <div className="hidden lg:flex justify-end gap-4 w-fit">
          <button
            onClick={cycleTheme}
            className="border border-[var(--border)] cursor-pointer bg-[var(--bg)] hover:bg-[var(--card)] hover:text-[var(--text)] transition-all active:scale-95 px-3 py-1.5 lg:px-3 lg:py-1.5 xl:px-4 xl:py-2 rounded-xl text-[var(--text)] text-sm lg:text-sm xl:text-base"
          >
            Change theme
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
