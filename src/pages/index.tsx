import { ColorMode, useColorMode } from "../hooks/useColorMode";
import { HomePage } from "../modules/home/home-page";
import { Header } from "../components/Header";

export default function Home() {
  const colorMode = useColorMode().mode;
  return (
    <div className="w-full h-full">
      {colorMode ? <div className={`w-full h-full ${colorMode === ColorMode.dark ? ColorMode.dark : ''}`}>
        <div className="dark:bg-gray-900 dark w-full h-full transition-colors duration-500">
          <Header />
          <HomePage />
        </div>
      </div> : null}
    </div>

  );
}
