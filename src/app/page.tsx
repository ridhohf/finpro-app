import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/heroSection";
import { FeaturedProperties } from "@/components/home/featuredProperties";
import { PopularDestinations } from "@/components/home/popularDestinations";
import { WhyChooseUs } from "@/components/home/whyChooseUs";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <HeroSection />
        <FeaturedProperties />
        <PopularDestinations />
        <WhyChooseUs />
      </main>

      <Footer />
    </div>
  );
}
