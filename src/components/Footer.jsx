const Footer = () => {
  const lastFetchDate = localStorage.getItem("lastFetchDate");

  return (
    <footer className="w-full mt-5 px-4 sm:px-6 lg:px-20 py-6">
      <div className="border-2 shadow-xl border-gray-300 rounded-[3rem] p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-full lg:w-[45%] flex justify-center lg:justify-start">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-medium">
            <span className="logo text-6xl sm:text-8xl lg:text-9xl">ljy</span>{" "}
            Rates
          </h1>
        </div>
        <div className="border-2 border-gray-300 rounded-4xl w-full lg:w-[55%] p-6 sm:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="w-full sm:w-[50%] flex flex-col gap-6 text-sm sm:text-base">
              <p>
                Prices shown are indicative mandi prices. Actual prices may vary
                based on quality, demand, and market conditions.
              </p>

              <p>Version 1.0.1 · Beta</p>
            </div>

            <div className="w-full sm:w-[50%] flex flex-col gap-6 text-sm sm:text-base">
              <p>Source: data.gov.in (Govt. of India)</p>
              <p>Last updated: Today · {lastFetchDate}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
