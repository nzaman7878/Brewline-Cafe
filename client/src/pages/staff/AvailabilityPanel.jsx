import { useState, useEffect, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Search, RefreshCw, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import api from '../../api/axios';

import { AvailabilityToggle } from '../../components/staff/AvailabilityToggle';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const AvailabilityPanel = () => {
  const { user, isLoading } = useContext(AuthContext);
  const { staffSocket } = useContext(SocketContext);
  
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFetching, setIsFetching] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Fetch full menu on load
  useEffect(() => {
    if (!user || !['admin', 'staff'].includes(user.role)) return;

    const fetchMenu = async () => {
      try {
        const { data } = await api.get('/menu');
        setMenu(data.data);
      } catch (err) {
        toast.error('Failed to load menu');
      } finally {
        setIsFetching(false);
      }
    };
    fetchMenu();
  }, [user]);

  // Real-time socket updates from other staff members toggling items
  useEffect(() => {
    if (!staffSocket) return;

    const handleMenuUpdate = (updatedItem) => {
      setMenu(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item));
    };

    staffSocket.on('menu-updated', handleMenuUpdate);

    return () => {
      staffSocket.off('menu-updated', handleMenuUpdate);
    };
  }, [staffSocket]);

  if (isLoading) return <div className="p-8">Loading...</div>;

  if (!user || !['admin', 'staff'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Handle Optimistic update from child
  const handleOptimisticUpdate = (updatedItem) => {
    setMenu(prev => prev.map(item => item._id === updatedItem._id ? updatedItem : item));
  };

  // Reset all 86'd items for a new day
  const handleResetAll = async () => {
    const unavailableItems = menu.filter(item => !item.isAvailable);
    if (unavailableItems.length === 0) {
      toast('All items are already available!', { icon: '✨' });
      return;
    }

    const confirm = window.confirm(`Reset ${unavailableItems.length} sold-out items to available?`);
    if (!confirm) return;

    setIsResetting(true);
    let successCount = 0;
    
    // Process sequentially to avoid rate limiting/overwhelming the DB
    for (const item of unavailableItems) {
      try {
        await api.put(`/staff/menu/${item._id}/availability`);
        successCount++;
        // Optimistically update
        setMenu(prev => prev.map(m => m._id === item._id ? { ...m, isAvailable: true } : m));
      } catch (e) {
        console.error('Failed to reset item', item.name);
      }
    }
    
    setIsResetting(false);
    toast.success(`Reset ${successCount} items. Ready for the day!`);
  };

  // Filtering
  const categories = ['All', ...new Set(menu.map(item => item.category))];
  
  let filteredMenu = menu;
  if (activeCategory !== 'All') {
    filteredMenu = filteredMenu.filter(item => item.category === activeCategory);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    filteredMenu = filteredMenu.filter(item => item.name.toLowerCase().includes(q));
  }

  // Split into available vs sold out for visual priority if not searching/filtering heavily
  const soldOutCount = menu.filter(m => !m.isAvailable).length;

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8 lg:py-12 max-w-7xl pt-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-headline font-extrabold text-on-surface">Quick 86 Panel</h1>
            <span className="bg-error/10 text-error px-3 py-1 rounded-full text-sm font-bold border border-error/20">
              {soldOutCount} Sold Out
            </span>
          </div>
          <p className="text-on-surface-variant">Toggle menu item availability instantly across all registers.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" as={Link} to="/staff/dashboard" className="flex-1 md:flex-none justify-center gap-2">
            <LayoutDashboard size={18} /> Kitchen Queue
          </Button>
          <Button 
            variant="primary" 
            onClick={handleResetAll} 
            isLoading={isResetting}
            className="flex-1 md:flex-none justify-center gap-2"
          >
            <RefreshCw size={18} /> Reset New Day
          </Button>
        </div>
      </div>

      <div className="bg-surface rounded-card border border-outline p-6 mb-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Input 
              icon={Search}
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  activeCategory === cat 
                    ? 'bg-primary text-on-primary' 
                    : 'bg-surface-variant text-on-surface-variant hover:bg-surface-variant/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {isFetching ? (
        <div className="text-center py-12 text-on-surface-variant">Loading menu...</div>
      ) : filteredMenu.length === 0 ? (
        <div className="text-center py-12 text-on-surface-variant border-2 border-dashed border-outline rounded-card">
          No items found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMenu.map(item => (
            <AvailabilityToggle 
              key={item._id} 
              item={item} 
              onOptimisticUpdate={handleOptimisticUpdate} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
