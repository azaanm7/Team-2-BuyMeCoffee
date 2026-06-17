import Image from "next/image";
import { PageButtons } from "./components/PageButtons";
import Header from "./components/Header";

export default function Home() {
  return (
    <div>
      <Header />
      <PageButtons />
    </div>
  );
}
