import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#D4A373', '#A87A51', '#7C5230', '#502A0F', '#8C6C55'];

export const CategoryDonutChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-on-surface-variant">No category data available</div>;
  }

  const chartData = data.map(item => ({
    name: item._id,
    value: item.count
  }));

  return (
    <div className="h-64 w-full flex flex-col items-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#231917', borderColor: '#3D2E2A', borderRadius: '8px', color: '#EDE0DB' }}
            itemStyle={{ color: '#EDE0DB' }}
            formatter={(value) => [value, 'Items Sold']}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', color: '#968E8B' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
