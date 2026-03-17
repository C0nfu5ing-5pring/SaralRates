import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

const Directions = ({ cycleTheme }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard cycleTheme={cycleTheme} />} />
      </Routes>
    </>
  );
};

export default Directions;
