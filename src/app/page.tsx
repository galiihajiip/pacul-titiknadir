import LayoutWrapper from "@/components/layout/LayoutWrapper";
import HeroSection from "@/components/features/dashboard-main/HeroSection";
import FeatureCards from "@/components/features/dashboard-main/FeatureCards";

export default function HomePage() {
  return (
    <LayoutWrapper>
      <HeroSection />
      <FeatureCards />
    </LayoutWrapper>
  );
}
