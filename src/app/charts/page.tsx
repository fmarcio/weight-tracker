import type { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";
import ChartsDashboard from "@/components/charts/ChartsDashboard";

export const metadata: Metadata = {
  title: "Visual Charts & Analytics - Weight Tracker",
  description: "Track your weight loss curve and workout consistency with interactive charts.",
};

export default function ChartsPage() {
  return (
    <ProtectedRoute>
      <ChartsDashboard />
    </ProtectedRoute>
  );
}
