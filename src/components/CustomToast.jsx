import { CheckCircle, XCircle } from "lucide-react";

const CustomToast = ({ msg, type }) => {
  return (
    <div className="flex items-center gap-2 bg-[var(--card)] w-full justify-start whitespace-pre-wrap text-[var(--text)] rounded-2xl border border-[var(--border)] shadow-md px-3 py-3">
      <div>
        {type === "info" ? (
          <XCircle className="text-red-500" size={25} />
        ) : (
          <CheckCircle className="text-green-500" size={25} />
        )}
      </div>

      <div>
        <p className="text-xs md:text-sm lg:text-base">{msg}</p>
      </div>
    </div>
  );
};

export default CustomToast;
