const Header = ({ search, setSearch, cycleTheme }) => {
  return (
    <header className="w-full mt-5 px-4 sm:px-6 lg:px-20 py-6 bg-[var(--bg)]  text-black transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 items-baseline gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-[var(--logo)]">
            <span className="logo text-5xl sm:text-6xl lg:text-7xl">ljy</span>{" "}
            Rates
          </h1>

          <button
            onClick={cycleTheme}
            className="lg:hidden text-sm border border-[var(--darker-border)]  px-3 py-1 rounded-xl bg-[var(--bg)]  text-[var(--text)] transition-colors duration-300 hover:bg-[var(--logo)] hover:text-[var(--sidebar-active)]"
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
              py-3 px-6
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

        <div className="hidden lg:flex justify-end gap-4">
          <button
            onClick={cycleTheme}
            className="border border-[var(--border)] cursor-pointer bg-[var(--bg)]  hover:bg-[var(--card)] hover:text-[var(--text)] transition-all active:scale-95 px-4 py-2 rounded-2xl text-[var(--text)]"
          >
            Change theme
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
