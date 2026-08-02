import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { User, CreditCard, ShoppingBag, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-headline font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar / Profile Summary */}
        <div className="space-y-6">
          <div className="bg-surface p-6 rounded-card border border-outline flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-surface-variant flex items-center justify-center mb-4">
              <User size={40} className="text-on-surface-variant" />
            </div>
            <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
            <p className="text-on-surface-variant mb-4">{user?.email}</p>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-badge text-sm font-label uppercase">
              {user?.role}
            </span>
          </div>
          
          <div className="bg-surface rounded-card border border-outline overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-surface-variant transition-colors border-b border-outline">
              <span className="flex items-center gap-2"><ShoppingBag size={18} /> Order History</span>
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-surface-variant transition-colors border-b border-outline">
              <span className="flex items-center gap-2"><CreditCard size={18} /> Payment Methods</span>
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 hover:bg-error/10 text-error transition-colors"
            >
              <span className="flex items-center gap-2"><LogOut size={18} /> Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content Area (Stats & Recent Activity) */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface p-6 rounded-card border border-outline">
              <h3 className="text-on-surface-variant text-sm mb-2">Total Orders</h3>
              <p className="text-3xl font-label text-primary">0</p>
            </div>
            <div className="bg-surface p-6 rounded-card border border-outline">
              <h3 className="text-on-surface-variant text-sm mb-2">Rewards Points</h3>
              <p className="text-3xl font-label text-primary">0</p>
            </div>
          </div>
          
          <div className="bg-surface p-6 rounded-card border border-outline">
            <h3 className="text-xl font-headline font-bold mb-4">Recent Orders</h3>
            <div className="text-center py-8 text-on-surface-variant">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-50" />
              <p>You haven't placed any orders yet.</p>
              <Button className="mt-4" onClick={() => navigate('/menu')}>Browse Menu</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
