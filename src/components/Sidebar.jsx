const Sidebar = ({ view, setView }) => {
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
        onClick={() => setView("all")} // lowercase 'all'
        className={`
          border border-gray-300
          active:scale-95 hover:shadow-md
          transition-all cursor-pointer
          whitespace-nowrap
          w-auto lg:w-full
          py-2 px-3 lg:py-3 lg:px-6
          rounded-2xl
          text-sm sm:text-base lg:text-xl
          ${
            view === "all"
              ? "bg-black text-white border-black"
              : "bg-white text-black hover:bg-black hover:text-white hover:border-black"
          }
        `}
      >
        Home
      </button>

      <button
        onClick={() => setView("favourites")} // lowercase 'favourites'
        className={`
          border border-gray-300
          active:scale-95 hover:shadow-md
          transition-all cursor-pointer
          whitespace-nowrap
          w-auto lg:w-full
          py-2 px-3 lg:py-3 lg:px-6
          rounded-2xl
          text-sm sm:text-base lg:text-xl
          ${
            view === "favourites"
              ? "bg-black text-white border-black"
              : "bg-white text-black hover:bg-black hover:text-white hover:border-black"
          }
        `}
      >
        Favourites
      </button>
    </div>
  );
};

export default Sidebar;
