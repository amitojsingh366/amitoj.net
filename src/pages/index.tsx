import { ColorMode, useColorMode } from "../hooks/useColorMode";
import { HomePage } from "../modules/home/home-page";
import { Header } from "../components/Header";
import { Headers } from "../components/Headers";

export default function Home() {
  const colorMode = useColorMode().mode;
  return (
    <div className="w-full h-full">
      <Headers
        title="Amitoj Singh"
        des="Amitoj Singh"
        image="https://avatars.githubusercontent.com/u/35400192?v=4" />

      {colorMode ? <div className={`w-full h-full ${colorMode === ColorMode.dark ? ColorMode.dark : ''}`}>
        <div className="dark:bg-gray-900 dark w-full h-full transition-colors duration-500">
          <Header />
          <HomePage />
        </div>
      </div> : null}
    </div>

  );
}
