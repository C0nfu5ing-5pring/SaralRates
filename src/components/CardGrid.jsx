import { VirtuosoGrid } from "react-virtuoso";
import PriceCard from "./PriceCard";
import html2canvas from "html2canvas";

export default function CardGrid({ list, isFavourite, toggleFavourite }) {
  const shareCardAsImage = async (element) => {
    const canvas = await html2canvas(element);
    const image = canvas.toDataURL("image/png");
    window.open(image);
  };

  return (
    <VirtuosoGrid
      className="h-[70vh] w-full"
      totalCount={list.length}
      listClassName="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3"
      itemContent={(index) => {
        const card = list[index];
        return (
          <PriceCard
            card={card}
            isFavourite={isFavourite}
            toggleFavourite={toggleFavourite}
            onShare={(e) =>
              shareCardAsImage(e.currentTarget.closest(".price-card"))
            }
          />
        );
      }}
    />
  );
}
