import { TriangleAlert } from "lucide-react";

export default function EmptyState({ view }) {
  return (
    <div className="flex flex-col justify-center h-[80vh] items-center">
      <TriangleAlert size={120} className="text-[var(--icon)]" />
      <p className="text-[var(--icon)] text-center">
        {view === "favourites"
          ? "No favourites added yet"
          : "No matching records"}
      </p>
    </div>
  );
}
