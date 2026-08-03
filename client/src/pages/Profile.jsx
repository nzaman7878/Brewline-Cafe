import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { User, ShoppingBag, LogOut, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [recentOrders, setRecentOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my?page=1&limit=3');
        setRecentOrders(data.data);
        setOrderCount(data.pagination?.total || data.count || 0);
      } catch (err) {
        // silent — non-critical
      }
    };
    fetchOrders();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const statusColors = {
    completed: 'text-success',
    ready_for_pickup: 'text-success',
    preparing: 'text-warning',
    paid: 'text-info',
    cancelled: 'text-error',
    refunded: 'text-error',
    pending_payment: 'text-on-surface-variant'
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-[calc(100vh-64px)]">
      <h1 className="text-3xl font-headline font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Sidebar / Profile Summary */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-card border border-outline flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary font-bold text-2xl font-headline">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <h2 className="text-xl font-bold text-on-surface">{user?.firstName} {user?.lastName}</h2>
            <p className="text-sm text-on-surface-variant mb-4">{user?.email}</p>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-badge text-xs font-label uppercase tracking-wider">
              {user?.role}
            </span>
          </div>
          
          <div className="bg-surface rounded-card border border-outline overflow-hidden">
            <Link 
              to="/orders"
              className="w-full flex items-center justify-between p-4 hover:bg-surface-variant transition-colors border-b border-outline text-on-surface"
            >
              <span className="flex items-center gap-2 text-sm font-bold"><ShoppingBag size={16} /> Order History</span>
              <ArrowRight size={16} className="text-on-surface-variant" />
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-error/10 text-error transition-colors text-sm font-bold"
            >
              <span className="flex items-center gap-2"><LogOut size={16} /> Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-6 rounded-card border border-outline">
              <h3 className="text-on-surface-variant text-sm font-bold uppercase tracking-wider mb-2">Total Orders</h3>
              <p className="text-3xl font-headline font-extrabold text-primary">{orderCount}</p>
            </div>
            <div className="bg-surface p-6 rounded-card border border-outline">
              <h3 className="text-on-surface-variant text-sm font-bold uppercase tracking-wider mb-2">Member Since</h3>
              <p className="text-xl font-headline font-extrabold text-on-surface">
                {user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'}
              </p>
            </div>
          </div>
          
          <div className="bg-surface p-6 rounded-card border border-outline">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-headline font-bold">Recent Orders</h3>
              {orderCount > 3 && (
                <Link to="/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </Link>
              )}
            </div>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-on-surface-variant">
                <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">You haven't placed any orders yet.</p>
                <Button className="mt-4" size="sm" onClick={() => navigate('/menu')}>Browse Menu</Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {recentOrders.map(order => (
                  <li key={order._id} className="flex justify-between items-center p-3 rounded-md bg-surface-variant/30 border border-outline">
                    <div>
                      <p className="text-sm font-bold text-on-surface">{order.items.length} item(s)</p>
                      <p className="text-xs text-on-surface-variant">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${order.total.toFixed(2)}</p>
                      <p className={`text-xs font-bold capitalize ${statusColors[order.status] || 'text-on-surface-variant'}`}>
                        {order.status.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
