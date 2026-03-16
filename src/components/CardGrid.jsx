import { VirtuosoGrid } from "react-virtuoso";
import PriceCard from "./PriceCard";
import html2canvas from "html2canvas";
import { toast } from "react-toastify";
import CustomToast from "./CustomToast";

export default function CardGrid({ list, favourites, toggleFavourite }) {
  const shareCardAsImage = async (element) => {
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        backgroundColor: "#ffffff",
        scale: 2,
        onclone: (doc) => {
          const card = doc.querySelector(".price-card");
          if (!card) return;

          doc.querySelectorAll("button, svg").forEach((el) => {
            el.style.display = "none";
          });

          doc.querySelectorAll("*").forEach((el) => {
            const computed = getComputedStyle(el);

            ["color", "backgroundColor", "borderColor"].forEach((prop) => {
              if (computed[prop]?.includes("oklch")) {
                if (prop === "backgroundColor") el.style[prop] = "#fff";
                else el.style[prop] = "#000";
              }
            });
          });

          card.style.transform = "none";
          card.style.transformStyle = "flat";

          const back = card.querySelector(".card-back");
          if (back) back.style.display = "none";
        },
      });

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png"),
      );

      if (!blob) throw new Error("Failed to generate image");

      const file = new File([blob], "saral-rate.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Saral Rates",
          text: "Check this mandi price",
        });
      } else {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = "saral-rate.png";
        link.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error("Error sharing card image:", err);
      toast(
        <CustomToast
          msg="Couldn't share image. Something went wrong."
          type="info"
        />,
      );
    }
  };

  return (
    <VirtuosoGrid
      className="h-[70vh] w-full"
      totalCount={list.length}
      listClassName="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 overflow-x-hidden"
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
