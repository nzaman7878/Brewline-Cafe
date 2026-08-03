import { useContext } from 'react';
import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Coffee, Tag, Users, BarChart3 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

export const AdminDashboard = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const navItems = [
    { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { name: 'Menu Manager', path: '/admin/menu', icon: Coffee },
    { name: 'Promotions', path: '/admin/promos', icon: Tag },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row pt-16">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-surface border-r border-outline flex-shrink-0 z-10 md:min-h-[calc(100vh-64px)]">
        <div className="p-6">
          <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-4">Admin Panel</h2>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-md font-bold transition-colors
                  ${isActive ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface hover:bg-surface-variant'}
                `}
              >
                <item.icon size={18} />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

    </div>
  );
};
