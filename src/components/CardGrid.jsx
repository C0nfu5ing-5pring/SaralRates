import { VirtuosoGrid } from "react-virtuoso";
import PriceCard from "./PriceCard";
import html2canvas from "html2canvas";

export default function CardGrid({ list, favourites, toggleFavourite }) {
  const shareCardAsImage = async (element) => {
    if (!element) return;

    const canvas = await html2canvas(element, {
      backgroundColor: "#ffffff",
      scale: 2,
      onclone: (doc) => {
        const card = doc.querySelector(".price-card");
        if (card) {
          card.style.transform = "none";
          card.style.transformStyle = "flat";
          const back = card.querySelector(".card-back");
          if (back) back.style.display = "none";
        }
        doc.querySelectorAll("*").forEach((el) => {
          const style = doc.defaultView.getComputedStyle(el);
          if (style.color.includes("oklch")) el.style.color = "#000";
          if (style.backgroundColor.includes("oklch"))
            el.style.backgroundColor = "#fff";
          if (style.borderColor.includes("oklch"))
            el.style.borderColor = "#ddd";
        });
      },
    });

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    const file = new File([blob], "saral-rate.png", { type: "image/png" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "Saral Rates",
        text: "Check this mandi price",
      });
    } else {
      alert("Sharing not supported on this browser.");
    }
  };

  return (
    <VirtuosoGrid
      className="h-[70vh] w-full"
      totalCount={list.length}
      listClassName="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
      itemContent={(index) => {
        const card = list[index];
        const fav = favourites.some(
          (f) => f.key === `${card.commodity}|${card.market}|${card.district}`,
        );

        return (
          <PriceCard
            key={card.commodity + card.market + card.district}
            card={card}
            toggleFavourite={toggleFavourite}
            onShare={shareCardAsImage}
            isFavourite={fav}
          />
        );
      }}
    />
  );
}
