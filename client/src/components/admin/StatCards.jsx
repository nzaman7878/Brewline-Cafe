import { DollarSign, ShoppingBag, Coffee, TrendingUp } from 'lucide-react';

export const StatCards = ({ data }) => {
  const { totalRevenue, dailyRevenue, topItems } = data;

  // Calculate totals from dailyRevenue array
  const totalOrders = dailyRevenue.reduce((sum, day) => sum + day.ordersCount, 0);
  const avgOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;
  
  // Today's revenue
  const todayString = new Date().toISOString().split('T')[0];
  const todayData = dailyRevenue.find(d => d._id === todayString);
  const todayRevenue = todayData ? todayData.revenue : 0;

  const stats = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-primary', bg: 'bg-primary/10' },
    { label: "Today's Revenue", value: `$${todayRevenue.toFixed(2)}`, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Avg Order Value', value: `$${avgOrderValue}`, icon: Coffee, color: 'text-warning', bg: 'bg-warning/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-surface rounded-card border border-outline p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
            <stat.icon size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-headline font-extrabold text-on-surface mt-1">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
