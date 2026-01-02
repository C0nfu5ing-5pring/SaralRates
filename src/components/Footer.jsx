import { Github, Database, Calendar, Info, Tag, Leaf } from "lucide-react";

const Footer = () => {
  const lastFetchDate = localStorage.getItem("lastFetchDate");

  return (
    <footer className="w-full bg-black text-white px-6 md:px-12 py-12 fixed bottom-0 -z-10">
      <div className="max-w-7xl mx-auto grid gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <Leaf className="text-green-500" size={28} />
            Saral Rates
          </h1>

          <p className="text-sm">
            Simple mandi prices for farmers and traders.
          </p>

          <div className="flex items-center gap-2 text-sm">
            <Database size={16} />
            <span>Source: data.gov.in (Govt. of India)</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Calendar size={16} />
            <span>Last updated: Today · {lastFetchDate}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-2 text-sm text-white">
            <Info size={20} />
            <p>
              Prices shown are indicative mandi prices. Actual prices may vary
              depending on quality, demand, and market conditions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-white">
            <Tag size={16} />
            <span>Version 1.0.0 · Beta</span>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:items-end">
          <a
            href="https://github.com/C0nfu5ing-5pring"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2
              px-4 py-2 rounded-lg
              border border-white
              text-sm text-gray-300
              hover:text-white hover:border-gray-500
              transition
            "
          >
            <Github size={18} />
            View on GitHub
          </a>

          <a
            href="https://c0nfu5ing-5pring.github.io/Shish/"
            target="_blank"
            className="text-xs text-gray-500"
          >
            Built by Shish Frutwala
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
