import { useState } from "react";
import compareTwo from "../images/compareTwo.png";
import decrease from "../images/decrease.png";
import increase from "../images/increase.png";
import favs from "../images/favs.png";
import latestFavs from "../images/latestFavs.png";
import search from "../images/search.png";
import bookmark from "../images/bookmark.png";

const LaunchModal = () => {
  const [count, setCount] = useState(0);
  const modalContent = [
    {
      title: "Welcome!",
      img: null,
      content:
        "Welcome to the SaralRates! This is my first major project! So, SaralRates is a price-tracking web-app that uses Indian Government API of daily prices for different commodities. Main purpose of this site is to spread awareness about the actual prices and to avoid being scammed by the middle man.",
    },
    {
      title: "Bookmark commodities",
      img: bookmark,
      content: "Bookmark the commodities that are most important to you.",
    },
    {
      title: "View your bookmarks",
      img: favs,
      content: "View your favourites, I mean bookmarks",
    },
    {
      title: "View latest bookmarks",
      img: latestFavs,
      content:
        "View the last 3 bookmarked commodities so you can view them on the go! (Only available for devices with larger screen size)",
    },
    {
      title: "Search commodities",
      img: search,
      content:
        "If too many cards overwhelm you then just go ahead and use the seachbar",
    },
    {
      title: "See increase in prices",
      img: increase,
      content:
        "Use the increase section to see all the commodities whose price has increase as compared to their previous price",
    },
    {
      title: "See decrease in prices",
      img: decrease,
      content:
        "Use the decrease section to see all the commodities whose price has decreased as compared to their previous price.",
    },
    {
      title: "Compare two commodities",
      img: compareTwo,
      content:
        "On smaller devices to select a card, tap and hold to compare any two commodities of your choice. On devices with larger screens, right click on any two cards to select them and compare them. Now that you know everything about this website, you can get started",
    },
  ];

  const current = modalContent[count];
  const [showLaunchModal, setShowLaunchModal] = useState(true);
  const onClose = () => {
    localStorage.setItem("hasVisited", true);
    setShowLaunchModal(false);
  };

  return (
    <>
      {showLaunchModal && (
        <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/80 mx-auto w-full">
          <div className="border-[var(--border)] border-2 rounded-xl bg-(--view-bg) h-150 w-90 md:w-120 lg:w-full p-10 lg:p-15 flex flex-col items-center justify-center gap-5 max-w-2xl">
            <h1 className="text-center text-3xl leading-8 lg:text-4xl text-[var(--logo)]">
              {current.title}
            </h1>
            <img
              className={`border-2 border-[var(--logo)] rounded-xl ${!current.img ? "hidden" : "block"} `}
              src={current.img}
            />
            <p className="text-center text-[var(--text)]">{current.content}</p>
            {count < modalContent.length - 1 ? (
              <button
                onClick={() => setCount(count + 1)}
                className="bg-[var(--variety-bg)] px-3 py-2 rounded-lg border border-[var(--variety-text)] active:scale-90 transition-all cursor-pointer"
              >
                Next
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={onClose}
                  className="bg-[var(--variety-bg)] px-3 py-2 rounded-xl active:scale-90 transition-all cursor-pointer"
                >
                  Get started
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default LaunchModal;
