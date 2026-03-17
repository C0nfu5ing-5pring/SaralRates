import { Info } from "lucide-react";
import { useState } from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  autoUpdate,
} from "@floating-ui/react";

export default function PriceWithTooltip({ price, trend }) {
  const [open, setOpen] = useState(false);

  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: coarse)").matches;

  const { x, y, reference, floating, strategy } = useFloating({
    placement: "right",
    middleware: [offset(6), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  return (
    <span className="inline-flex items-center gap-1 relative">
      <span
        ref={reference}
        className="flex items-center gap-1 cursor-pointer"
        onMouseEnter={() => !isTouch && setOpen(true)}
        onMouseLeave={() => !isTouch && setOpen(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (isTouch) setOpen((v) => !v);
        }}
      >
        <span className="font-black text-base">{price}</span>
        {trend && <Info size={16} className="text-blue-500" />}
      </span>

      {open && trend && (
        <div
          ref={floating}
          style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
          className="z-50 rounded-xl bg-gray-900 px-3 py-2 text-xs text-white shadow-2xl whitespace-nowrap"
        >
          <p className="text-gray-400">Trend</p>
          <p className="font-semibold">{trend}</p>
        </div>
      )}
    </span>
  );
}
