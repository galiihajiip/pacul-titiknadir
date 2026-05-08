import WelcomeSection from "@/components/features/dashboard-main/WelcomeSection";
import KpiCards from "@/components/features/dashboard-main/KpiCards";
import WeeklyChart from "@/components/features/dashboard-main/WeeklyChart";
import ActiveChallenges from "@/components/features/dashboard-main/ActiveChallenges";
import AktivitasKomunitas from "@/components/features/dashboard-main/AktivitasKomunitas";
import TipsHariIni from "@/components/features/dashboard-main/TipsHariIni";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome greeting */}
      <WelcomeSection />

      {/* KPI cards — 4 columns */}
      <KpiCards />

      {/* Grid 1: Emisi chart (60%) | Active challenges (40%) */}
      <div className="grid gap-6 lg:grid-cols-[60fr_40fr]">
        <WeeklyChart />
        <ActiveChallenges />
      </div>

      {/* Grid 2: Community activity (60%) | Tips (40%) */}
      <div className="grid gap-6 lg:grid-cols-[60fr_40fr]">
        <AktivitasKomunitas />
        <TipsHariIni />
      </div>
    </div>
  );
}
