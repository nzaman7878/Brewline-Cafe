import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { StatCards } from '../../components/admin/StatCards';
import { RevenueChart } from '../../components/admin/RevenueChart';
import { TopItemsChart } from '../../components/admin/TopItemsChart';
import { CategoryDonutChart } from '../../components/admin/CategoryDonutChart';
import toast from 'react-hot-toast';

export const Analytics = () => {
  const [data, setData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        setData(res.data.data);
      } catch (err) {
        toast.error('Failed to load analytics data');
      } finally {
        setIsFetching(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (isFetching) {
    return <div className="p-8 text-center text-on-surface-variant animate-pulse">Gathering insights...</div>;
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface">Analytics</h1>
          <p className="text-on-surface-variant">Insights and performance metrics for Brewline Cafe.</p>
        </div>
        <Button variant="outline" onClick={() => window.print()} className="gap-2">
          <Download size={18} /> Export Report
        </Button>
      </div>

      <StatCards data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart (Spans 2 cols) */}
        <div className="lg:col-span-2 bg-surface rounded-card border border-outline p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-headline font-bold text-lg text-on-surface">Revenue Over Time</h3>
            <p className="text-sm text-on-surface-variant">Daily gross revenue from completed orders.</p>
          </div>
          <RevenueChart data={data.dailyRevenue} />
        </div>

        {/* Right Col */}
        <div className="space-y-6">
          <div className="bg-surface rounded-card border border-outline p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-headline font-bold text-lg text-on-surface">Top Selling Items</h3>
              <p className="text-sm text-on-surface-variant">By total volume sold.</p>
            </div>
            <TopItemsChart data={data.topItems} />
          </div>

          <div className="bg-surface rounded-card border border-outline p-6 shadow-sm">
            <div className="mb-4">
              <h3 className="font-headline font-bold text-lg text-on-surface">Sales by Category</h3>
              <p className="text-sm text-on-surface-variant">Volume distribution across menu categories.</p>
            </div>
            <CategoryDonutChart data={data.categories} />
          </div>
        </div>

      </div>

    </div>
  );
};
