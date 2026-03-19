import { X } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const intl = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

export default function CompareModal({ items, onClose }) {
  const [a, b] = items;

  const mergedHistory = [...(a.priceHistory ?? [])]
    .reverse()
    .map((entry, i) => ({
      date: new Date(entry.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      a: entry.modal_price,
      b: b.priceHistory
        ? ([...b.priceHistory].reverse()[i]?.modal_price ?? null)
        : null,
    }));

  return (
    <div
      className="fixed inset-0 z-20 bg-black/80 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl w-full max-w-2xl p-6 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <p className="text-xs uppercase tracking-widest text-[var(--muted-text)]">
            Comparing
          </p>

          <button
            onClick={onClose}
            className="cursor-pointer active:scale-90 transition-all"
          >
            <X className="text-[var(--icon)] w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[a, b].map((item, id) => (
            <div
              key={id}
              className="rounded-xl p-4 flex flex-col gap-1 bg-[var(--view-bg)] border border-[var(--border)]"
            >
              <span className="text-[10px] font-mono px-2 py-0.5 rounded w-fit border border-[var(--border)] bg-[var(--sidebar-bg)]">
                {id === 0 ? "A" : "B"}
              </span>
              <h1 className="text-base font-medium mt-1 text-[var(--logo)]">
                {item.commodity}
              </h1>
              <p className="text-xs text-[var(--text-muted)]">
                {item.market}, {item.district}
              </p>
              <div className="mt-2">
                <p className="text-[9px] uppercase tracking-widest text-[var(--text-muted)] mb-1">
                  Common price
                </p>
                <p className="text-2xl font-medium text-[var(--icon)]">
                  {intl.format(item.modal_price).split(".")[0]}
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  ≈ {intl.format(item.modal_price / 100).split(".")[0]}/kg
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[var(--border)] p-4 bg-[var(--view-bg)]">
          <p className="text-[9px] tracking-widest text-[var(--muted-text)] mb-3">
            7-DAY TREND
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={mergedHistory}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#eab308" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#eab308" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date"
                tick={{ fontSize: 9 }}
                stroke="var(--axis)"
              />
              <YAxis hide />
              <Tooltip
                formatter={(val, name) => [
                  intl.format(val).split(".")[0],
                  name === "a"
                    ? a.commodity.split("(")[0]
                    : b.commodity.split("(")[0],
                ]}
                contentStyle={{
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  fontSize: 11,
                  borderRadius: 12,
                }}
              />
              <Legend
                formatter={(val) =>
                  val === "a"
                    ? a.commodity.split("(")[0].split("/")[0]
                    : b.commodity.split("(")[0].split("/")[0]
                }
                wrapperStyle={{ fontSize: 11 }}
              />
              <Area
                dataKey="a"
                stroke="var(--logo)"
                fill="var(--logo)"
                fillOpacity={0.1}
                strokeWidth={1.5}
                dot={false}
                type="basis"
              />
              <Area
                dataKey="b"
                stroke="var(--menu)"
                fill="var(--menu)"
                fillOpacity={0.1}
                strokeWidth={1.5}
                dot={false}
                type="basis"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3 overflow-x-auto">
          {[a, b].map((item, id) => (
            <div key={id}>
              <p
                className={`text-[9px] tracking-widest mb-2 text-[var(--text)]`}
              >
                {id === 0 ? "A" : "B"} - Daily
              </p>
              <div className="flex gap-1">
                {[...(item.priceHistory ?? [])]
                  .slice(0, 7)
                  .reverse()
                  .map((item, id) => (
                    <div
                      key={id}
                      className={`flex-1 rounded-md py-1 px-0.5 flex flex-col items-center justify-center gap-0.5 border bg-[var(--view-bg)] border-[var(--border)]`}
                    >
                      <span className="text-[8px] text-[var(--muted-text)]">
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                      <span className={`text-[10px] text-[var(--logo)]`}>
                        ₹{(item.modal_price / 1000).toFixed(1)}k
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
