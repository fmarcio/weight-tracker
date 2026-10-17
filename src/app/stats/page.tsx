import type { Metadata } from 'next';
import ProtectedRoute from '@/components/ProtectedRoute';
import StatsDashboard from '@/components/StatsDashboard';

export const metadata: Metadata = {
  title: 'Stats & Progression - Weight Tracker',
  description:
    'View monthly weigh-in frequencies and detailed weight evolution statistics.',
};

export default function StatsPage() {
  return (
    <ProtectedRoute>
      <StatsDashboard />
    </ProtectedRoute>
  );
}
