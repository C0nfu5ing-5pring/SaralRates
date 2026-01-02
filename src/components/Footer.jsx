import { Github, Leaf } from "lucide-react";

const Footer = () => {
  const lastFetchDate = localStorage.getItem("lastFetchDate");

  return (
    <footer
      className="w-full bg-linear-to-b from-neutral-900 to-black
border-t border-white/10 text-white px-6 md:px-12 py-12 mt-20"
    >
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Leaf className="text-green-500" size={26} />
            Saral Rates
          </h1>

          <p className="text-sm text-gray-400 max-w-xs">
            Simple mandi prices for farmers and traders.
          </p>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Source: data.gov.in (Govt. of India)</p>
            <p>Last updated: Today · {lastFetchDate}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 text-sm text-gray-400">
          <div className="leading-relaxed">
            <p className="leading-relaxed">
              Prices shown are indicative mandi prices. Actual prices may vary
              based on quality, demand, and market conditions.
            </p>

            <p className="text-xs text-gray-500">Version 1.0.0 · Beta</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <a
            href="https://github.com/C0nfu5ing-5pring"
            target="_blank"
            className="
              flex items-center gap-2
      px-4 py-2 rounded-xl
      bg-white/5 border border-white/10
      text-sm text-gray-300
      hover:bg-white/10 hover:text-white
      transition
            "
          >
            <Github size={18} />
            View on GitHub
          </a>

          <a
            href="https://c0nfu5ing-5pring.github.io/Shish/"
            target="_blank"
            className="text-xs text-gray-500 hover:text-gray-300 transition"
          >
            Built by Shish Frutwala
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
