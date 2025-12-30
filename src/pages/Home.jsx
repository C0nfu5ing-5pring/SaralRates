import { useMediaQuery } from "react-responsive";
import HomeDesktop from "../components/HomeDesktop";
import HomeMobile from "../components/HomeMobile";

const Home = () => {
  const isMobile = useMediaQuery({ maxWidth: 500 });
  return <>{isMobile ? <HomeMobile /> : <HomeDesktop />}</>;
};

export default Home;
