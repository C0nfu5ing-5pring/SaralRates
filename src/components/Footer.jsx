const Footer = () => {
  const lastFetchedDate = localStorage.getItem("lastFetchedDate");
  return (
    <footer className="text-[var[--text]] w-full mt-5 px-4 sm:px-6 lg:px-20 py-6 select-none">
      <div className="border-2 flex lg:hidden shadow-xl shadow-[var(--shadow)] border-[var(--darker-border)] rounded-[3rem] p-6 sm:p-10 flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-full lg:w-[45%] flex justify-center">
          <div className="w-full flex lg:hidden flex-col gap-2">
            <div className="flex justify-start gap-3">
              <div className="border-[var(--variety-bg)] text-xs md:text-sm cursor-pointer border hover:border-2 transition-all px-3 py-1 rounded-lg">
                v0.5.1
              </div>
              <div className="border-[var(--variety-bg)] text-xs md:text-sm cursor-pointer border hover:border-2 transition-all px-3 py-1 rounded-lg">
                Alpha
              </div>
              <div className="border-[var(--variety-bg)] text-xs md:text-sm cursor-pointer border hover:border-2 transition-all px-3 py-1 rounded-lg">
                Live
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <h1 className="text-sm md:text-base">Source</h1>
                <p className="text-[var(--variety-bg)]  text-xs md:text-base">
                  data.gov.in
                </p>
              </div>
              <div className="flex justify-between">
                <h1 className="text-sm md:text-base">Updated</h1>
                <p className="text-[var(--variety-bg)] text-xs md:text-base">
                  {lastFetchedDate}
                </p>
              </div>
              <div className="flex justify-between mt-2">
                <p className="text-xs">
                  Indicative prices only. Real prices may vary from place to
                  place
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
