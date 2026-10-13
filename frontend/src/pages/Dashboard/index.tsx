import { Header } from "../../components/layout/Header";
import { StatsGrid } from "../../components/dashboard/StatsGrid";
import {
  TrendsChart,
  ModelBarChart,
  ModelRadarChart,
} from "../../components/dashboard/Charts";
import { RecentActivity } from "../../components/dashboard/RecentActivity";
import { QuickActions } from "../../components/dashboard/QuickActions";
import { useAsync } from "../../hooks";
import { api } from "../../services/api";

export default function DashboardPage() {
  const stats = useAsync(() => api.getDashboardStats(), []);
  const trends = useAsync(() => api.getTrends(), []);
  const performance = useAsync(() => api.getModelPerformance(), []);
  const activity = useAsync(() => api.getRecentActivity(), []);

  return (
    <div className="space-y-6">
      <Header
        title="Dashboard"
        subtitle="Overview of your evaluation workspace"
      />

      <StatsGrid stats={stats.data} loading={stats.loading} />

      <QuickActions />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendsChart data={trends.data} loading={trends.loading} />
        <ModelBarChart
          data={performance.data}
          loading={performance.loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          activities={activity.data}
          loading={activity.loading}
        />
        <ModelRadarChart
          data={performance.data}
          loading={performance.loading}
        />
      </div>
    </div>
  );
}
