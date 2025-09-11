import HeroSection from "@/components/HeroSection";
import MakeTrust from "@/components/MakeTrust";
import NewestProducts from "@/components/NewestProducts";
import Services from "@/components/Services";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MakeTrust />
      <Services />
      <NewestProducts />
    </>
  );
}
