import HeroSection from "@/components/HeroSection";
import MakeTrust from "@/components/MakeTrust";
import NewestProducts from "@/components/NewestProducts";
import Services from "@/components/Services";

export default function HomePage() {
  return (
    <>
      <div className="container mx-auto border m-4 mt-0 rounded-b-2xl overflow-hidden">
        <HeroSection />
      </div>
      <MakeTrust />
      <Services />

      <NewestProducts />
    </>
  );
}
