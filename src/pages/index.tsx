import { ColorMode, useColorMode } from "../hooks/useColorMode";
import { HomePage } from "../modules/home/home-page";
import { Header } from "../components/Header";

export default function Home() {
  return (
    <div className={`w-full h-full ${useColorMode().mode === ColorMode.dark ? ColorMode.dark : ''}`}>
      <div className="dark:bg-gray-900 dark w-full h-full transition-colors duration-500">
        <Header />
        <HomePage />
        <HomePage />
        <HomePage />
        <HomePage />
        <HomePage />
        <HomePage />
        <HomePage />
      </div>
    </div>
  );
}
