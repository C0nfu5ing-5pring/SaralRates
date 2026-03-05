import { TriangleAlert } from "lucide-react";

export default function EmptyState({ view, hasPriceHistory }) {
  return (
    <div className="flex flex-col justify-center h-[80vh] items-center">
      <TriangleAlert size={120} style={{ color: "gray" }} />
      <p className="text-gray-500 text-center">
        {view === "favourites"
          ? "No favourites added yet"
          : hasPriceHistory
            ? "No matching records"
            : "Price history not available yet"}
      </p>
    </div>
  );
}
