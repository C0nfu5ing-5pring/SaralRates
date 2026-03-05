import { usePrices } from "../hooks/usePrices";
import CardGrid from "./CardGrid";
import LoadingState from "./LoadingState";
import EmptyState from "./EmptyState";

export default function Card({ search, view, hasPriceHistory }) {
  const { finalList, loading, favourites, toggleFavourite } = usePrices(
    search,
    view,
    hasPriceHistory,
  );

  const isFavourite = (item) => {
    const key = `${item.commodity}|${item.market}|${item.district}`;
    return favourites.some((f) => f.key === key);
  };

  if (loading) return <LoadingState />;
  if (!finalList.length)
    return <EmptyState view={view} hasPriceHistory={hasPriceHistory} />;

  return (
    <CardGrid
      list={finalList}
      favourites={favourites}
      toggleFavourite={toggleFavourite}
      isFavourite={isFavourite}
    />
  );
}
