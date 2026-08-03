import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const TopItemsChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-on-surface-variant">No item data available</div>;
  }

  // Use only top 5 for better visibility in a small chart, data is already sorted by quantitySold descending
  const chartData = data.slice(0, 5).map(item => ({
    name: item._id,
    quantity: item.quantitySold
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#3D2E2A" horizontal={false} />
          <XAxis 
            type="number"
            stroke="#968E8B" 
            tick={{ fill: '#968E8B', fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            type="category"
            dataKey="name" 
            stroke="#968E8B" 
            tick={{ fill: '#968E8B', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={100}
          />
          <Tooltip 
            cursor={{ fill: '#3D2E2A', opacity: 0.4 }}
            contentStyle={{ backgroundColor: '#231917', borderColor: '#3D2E2A', borderRadius: '8px', color: '#EDE0DB' }}
            itemStyle={{ color: '#D4A373' }}
            formatter={(value) => [value, 'Sold']}
          />
          <Bar dataKey="quantity" fill="#D4A373" radius={[0, 4, 4, 0]} barSize={24} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
