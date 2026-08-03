import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Users, Coffee, ArrowRight } from 'lucide-react';
import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';

export const AdminOverview = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, ordersRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/orders?status=paid')
        ]);
        setAnalytics(analyticsRes.data.data);
        setOrders(ordersRes.data.data.slice(0, 5));
      } catch (err) {
        // ignore, not critical
      }
    };
    fetchData();
  }, []);

  const totalOrders = analytics?.dailyRevenue?.reduce((sum, d) => sum + d.ordersCount, 0) || 0;

  const quickLinks = [
    { label: 'Manage Menu', path: '/admin/menu', icon: Coffee, color: 'bg-primary/10 text-primary' },
    { label: 'View Orders', path: '/admin/orders', icon: ShoppingBag, color: 'bg-info/10 text-info' },
    { label: 'Analytics', path: '/admin/analytics', icon: TrendingUp, color: 'bg-success/10 text-success' },
    { label: 'Manage Users', path: '/admin/users', icon: Users, color: 'bg-warning/10 text-warning' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">Good morning, {user?.firstName} 👋</h1>
        <p className="text-on-surface-variant">Here's what's happening at Brewline Cafe today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface rounded-card border border-outline p-6">
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Revenue</p>
          <p className="text-3xl font-headline font-extrabold text-primary mt-2">
            ${analytics?.totalRevenue?.toFixed(2) ?? '—'}
          </p>
        </div>
        <div className="bg-surface rounded-card border border-outline p-6">
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Orders</p>
          <p className="text-3xl font-headline font-extrabold text-info mt-2">{totalOrders}</p>
        </div>
        <div className="bg-surface rounded-card border border-outline p-6">
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Pending (New)</p>
          <p className="text-3xl font-headline font-extrabold text-warning mt-2">{orders.length}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickLinks.map((item) => (
          <Link key={item.label} to={item.path} className="bg-surface rounded-card border border-outline p-5 flex flex-col items-center gap-3 hover:border-primary/50 hover:shadow-md transition-all group">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}>
              <item.icon size={24} />
            </div>
            <span className="text-sm font-bold text-on-surface text-center group-hover:text-primary transition-colors">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent New Orders */}
      <div className="bg-surface rounded-card border border-outline overflow-hidden">
        <div className="p-5 border-b border-outline flex justify-between items-center">
          <h3 className="font-headline font-bold text-lg">New Orders (Paid)</h3>
          <Link to="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        {orders.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant">No new orders.</div>
        ) : (
          <ul className="divide-y divide-outline">
            {orders.map(order => (
              <li key={order._id} className="px-5 py-3 flex justify-between items-center hover:bg-surface-variant/30">
                <div>
                  <p className="font-bold text-sm">{order.guestName || order.customer?.firstName || 'Guest'}</p>
                  <p className="text-xs text-on-surface-variant">{order.items.length} item(s)</p>
                </div>
                <span className="font-bold text-primary">${order.total.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
