import { useState } from "react";

const Sidebar = () => {
  const [selected, setSelected] = useState("");

  return (
    <>
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
          onClick={() => setSelected("Filter")}
          aria-selected={selected === "Filter"}
          className="
            border border-gray-300 
            hover:bg-black hover:text-white hover:border-black active:scale-95 hover:shadow-md 
            transition-all cursor-pointer
            whitespace-nowrap
            w-auto lg:w-full
            py-2 px-3 lg:py-3 lg:px-6
            rounded-xl
            text-sm sm:text-base lg:text-xl
            text-black 
          "
        >
          Filter
        </button>

        <button
          onClick={() => setSelected("Favourites")}
          aria-selected={selected === "Favourites"}
          className="
            border border-gray-300 
            hover:bg-black hover:text-white hover:border-black active:scale-95 hover:shadow-md 
            transition-all cursor-pointer
            whitespace-nowrap
            w-auto lg:w-full
            py-2 px-3 lg:py-3 lg:px-6
            rounded-2xl
            text-sm sm:text-base lg:text-xl
            text-black 
          "
        >
          Favourites
        </button>

        <button
          onClick={() => setSelected("Recently Viewed")}
          aria-selected={selected === "Recently Viewed"}
          className="
            border border-gray-300 
            hover:bg-black hover:text-white hover:border-black active:scale-95 hover:shadow-md 
            transition-all cursor-pointer
            whitespace-nowrap
            w-auto lg:w-full
            py-2 px-3 lg:py-3 lg:px-6
            rounded-xl
            text-sm sm:text-base lg:text-xl
            text-black 
          "
        >
          Recently Viewed
        </button>
      </div>
    </>
  );
};

export default Sidebar;
