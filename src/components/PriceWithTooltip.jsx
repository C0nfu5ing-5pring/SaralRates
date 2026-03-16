import { Info } from "lucide-react";
import { useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

const intl = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default function PriceWithTooltip({ modalPrice, previousModalPrice }) {
  const [open, setOpen] = useState(false);

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const { x, y, reference, floating, strategy } = useFloating({
    placement: "top",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  return (
    <div className="flex items-center gap-2 relative">
      <p className="font-semibold text-lg md:text-xl lg:text-2xl">
        {intl.format(modalPrice)}
      </p>

      {previousModalPrice != null && (
        <button
          ref={reference}
          onMouseEnter={!isTouch ? () => setOpen(true) : undefined}
          onMouseLeave={!isTouch ? () => setOpen(false) : undefined}
          onClick={(e) => {
            e.stopPropagation();
            if (isTouch) setOpen((v) => !v);
          }}
        >
          <Info size={16} className="text-blue-500" />
        </button>
      )}

      {open && previousModalPrice != null && (
        <div
          ref={floating}
          style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
          className="z-50 rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-2xl"
        >
          <p className="text-gray-400">Previous price</p>
          <p className="font-semibold">{intl.format(previousModalPrice)}</p>
        </div>
      )}
    </div>
  );
}
