import Directions from "./Directions";
import { useEffect, useState } from "react";

const App = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => {
      if (prev === "light") return "dark";
      return "light";
    });
  };
  return (
    <div>
      <Directions cycleTheme={cycleTheme} />
    </div>
  );
};

export default App;
