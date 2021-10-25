import { HomePage } from "../modules/home/home-page";
import { Header } from "../components/Header";
import { Headers } from "../components/Headers";

export default function Home() {
  return (
    <div className="dark:bg-gray-900 dark w-full h-full transition-colors duration-500">
      <Headers
        title="Amitoj Singh"
        des="Amitoj Singh"
        image="https://avatars.githubusercontent.com/u/35400192?v=4" />
      <Header />
      <HomePage />
    </div>
  );
}
