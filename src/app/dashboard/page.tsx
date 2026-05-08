import WelcomeBanner from "@/components/features/dashboard-main/WelcomeBanner";
import KpiCards from "@/components/features/dashboard-main/KpiCards";
import WeeklyChart from "@/components/features/dashboard-main/WeeklyChart";
import ActiveChallenges from "@/components/features/dashboard-main/ActiveChallenges";
import TipsHariIni from "@/components/features/dashboard-main/TipsHariIni";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Welcome + XP banner */}
      <WelcomeBanner />

      {/* KPI cards row */}
      <KpiCards />

      {/* Main grid: chart + challenges (left 60%) | tips (right 40%) */}
      <div className="grid gap-6 lg:grid-cols-[60fr_40fr]">
        {/* Left column */}
        <div className="flex flex-col gap-6">
          <WeeklyChart />
          <ActiveChallenges />
        </div>

        {/* Right column */}
        <TipsHariIni />
      </div>
    </div>
  );
}
