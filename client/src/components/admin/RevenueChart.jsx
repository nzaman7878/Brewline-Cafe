import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const RevenueChart = ({ data }) => {
  // Format data for Recharts
  const chartData = data.map(item => ({
    date: new Date(item._id).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    revenue: item.revenue,
    orders: item.ordersCount
  }));

  if (chartData.length === 0) {
    return <div className="h-64 flex items-center justify-center text-on-surface-variant">No revenue data available</div>;
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3D2E2A" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#968E8B" 
            tick={{ fill: '#968E8B', fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            yAxisId="left"
            stroke="#968E8B" 
            tick={{ fill: '#968E8B', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#231917', borderColor: '#3D2E2A', borderRadius: '8px', color: '#EDE0DB' }}
            itemStyle={{ color: '#D4A373' }}
            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="revenue" 
            stroke="#D4A373" 
            strokeWidth={3}
            dot={{ fill: '#D4A373', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
