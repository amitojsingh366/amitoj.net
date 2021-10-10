import { HomePage } from "../modules/home/home-page";
import { Header } from "../components/Header";
import { Headers } from "../components/Headers";
import { useEffect, useState } from "react";
import { ColorMode, useColorMode } from "../hooks/useColorMode";

export default function Home() {
  const [currentColor, setCurrentColor] = useState(ColorMode.dark);
  const colorMode = useColorMode.getState().mode;

  useEffect(() => {
    setCurrentColor(colorMode);
  }, [colorMode])

  return (
    <div className="dark:bg-gray-900 dark w-full h-full transition-colors duration-500">
      <Headers
        title="Amitoj Singh"
        des="Amitoj Singh"
        image="https://avatars.githubusercontent.com/u/35400192?v=4" />
      <Header colorMode={currentColor} />
      <HomePage colorMode={currentColor} />
    </div>
  );
}
