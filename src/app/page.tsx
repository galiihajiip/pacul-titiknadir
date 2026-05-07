import LayoutWrapper from "@/components/layout/LayoutWrapper";
import HeroSection from "@/components/features/dashboard-main/HeroSection";
import FeatureCards from "@/components/features/dashboard-main/FeatureCards";
import StatsSection from "@/components/features/dashboard-main/StatsSection";
import CTABlocks from "@/components/features/dashboard-main/CTABlocks";

export default function HomePage() {
  return (
    <LayoutWrapper>
      <HeroSection />
      <FeatureCards />
      <StatsSection />
      <CTABlocks />
    </LayoutWrapper>
  );
}
