import LayoutWrapper from "@/components/layout/LayoutWrapper";
import PageWrapper from "@/components/common/PageWrapper";
import HeroSection from "@/components/features/dashboard-main/HeroSection";
import FeatureCards from "@/components/features/dashboard-main/FeatureCards";
import StatsSection from "@/components/features/dashboard-main/StatsSection";
import CTABlocks from "@/components/features/dashboard-main/CTABlocks";

export default function HomePage() {
  return (
    <LayoutWrapper>
      <PageWrapper>
        <HeroSection />
        <FeatureCards />
        <StatsSection />
        <CTABlocks />
      </PageWrapper>
    </LayoutWrapper>
  );
}
