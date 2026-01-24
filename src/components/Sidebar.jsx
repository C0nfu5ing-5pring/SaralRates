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
        "
      >
        <button
          onClick={() => setSelected("Filter")}
          aria-selected={selected === "Filter"}
          className="border border-gray-300 hover:border-black hover:shadow-md active:scale-95 aria-selected:bg-black aria-selected:text-white bg-white hover:bg-black hover:text-white transition-all cursor-pointer 
          whitespace-nowrap 
          w-auto lg:w-full
          py-2 px-3 lg:py-3 lg:px-6 
          rounded-xl 
          text-sm sm:text-base lg:text-xl"
        >
          Filter
        </button>

        <button
          onClick={() => setSelected("Favourites")}
          aria-selected={selected === "Favourites"}
          className="border border-gray-300 hover:border-black hover:shadow-md active:scale-95 aria-selected:bg-black aria-selected:text-white bg-white hover:bg-black hover:text-white transition-all cursor-pointer 
          whitespace-nowrap 
          w-auto lg:w-full
          py-2 px-3 lg:py-3 lg:px-6 
          rounded-xl 
          text-sm sm:text-base lg:text-xl"
        >
          Favourites
        </button>

        <button
          onClick={() => setSelected("Recently Viewed")}
          aria-selected={selected === "Recently Viewed"}
          className="border border-gray-300 hover:border-black hover:shadow-md active:scale-95 aria-selected:bg-black aria-selected:text-white bg-white hover:bg-black hover:text-white transition-all cursor-pointer 
          whitespace-nowrap 
          w-auto lg:w-full
          py-2 px-3 lg:py-3 lg:px-6 
          rounded-xl 
          text-sm sm:text-base lg:text-xl"
        >
          Recently Viewed
        </button>
      </div>
    </>
  );
};

export default Sidebar;
