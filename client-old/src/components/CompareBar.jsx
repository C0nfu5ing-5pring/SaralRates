import { useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import CustomToast from "./CustomToast.jsx";
import { compareSound } from "./Sound.jsx";

export default function CompareBar({ item, onCancel }) {
  useEffect(() => {
    compareSound.play();
    toast(<CustomToast msg="One commodity selected. Choose one more." />, {});
  }, []);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 bg-[var(--bg)] border border-[var(--border)] rounded-2xl px-5 py-3 flex items-center gap-4 shadow-xl">
      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
      <p className="text-sm text-[var(--text)]">
        <span className="font-thin">
          {item.commodity.split("(")[0].split("/")[0]}
        </span>
        <span className="text-[var(--muted-text)] ml-1">selected</span>
      </p>
      <button
        onClick={onCancel}
        className="transition-all cursor-pointer active:scale-90"
      >
        <X className="w-4 h-4 text-[var(--icon)]" />
      </button>
    </div>
  );
}
