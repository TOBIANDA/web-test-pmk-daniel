import Navbar from "@/components/navbar";
import Hero from "@/features/landing/sections/hero";
import About from "@/features/landing/sections/about";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
    </main>
  );
}