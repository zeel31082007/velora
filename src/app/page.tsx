import CursorGlow from "@/components/CursorGlow";
import HeroSection from "@/components/HeroSection";
import ShootingStars from "@/components/ShootingStars";
import StarsBackground from "@/components/StarsBackground";
import WhyVeloraSection from "@/components/WhyVeloraSection";
import YourUniverseSection from "@/components/YourUniverseSection";
import CosmicDiscovery from "@/components/CosmicDiscovery";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#030014]">
      <StarsBackground />
      <CursorGlow />
      <ShootingStars />
      <HeroSection />
      <WhyVeloraSection />
      <YourUniverseSection />
      <CosmicDiscovery />
    </div>
  );
}
