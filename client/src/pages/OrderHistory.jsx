import { useState, useEffect } from 'react';
import api from '../api/axios';
import { OrderHistoryCard } from '../components/orders/OrderHistoryCard';
import { Button } from '../components/ui/Button';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';
import toast from 'react-hot-toast';

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/orders/my?page=${page}&limit=5`);
      setOrders(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error('Failed to load order history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 md:py-12 min-h-[calc(100vh-64px)]">
      
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <History size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-on-surface">Order History</h1>
          <p className="text-on-surface-variant">View your past orders and quickly reorder your favorites.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-surface rounded-card border border-outline animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-surface rounded-card border border-outline p-12 text-center flex flex-col items-center">
          <History size={48} className="text-on-surface-variant mb-4 opacity-50" />
          <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No past orders found</h3>
          <p className="text-on-surface-variant max-w-sm mb-6">Looks like you haven't ordered anything yet. Time to get some coffee!</p>
          <Button onClick={() => window.location.href = '/menu'}>Browse Menu</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderHistoryCard key={order._id} order={order} />
          ))}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center pt-6">
              <Button 
                variant="outline" 
                disabled={pagination.page === 1}
                onClick={() => fetchOrders(pagination.page - 1)}
                className="gap-2"
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <span className="text-sm font-bold text-on-surface-variant">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button 
                variant="outline" 
                disabled={pagination.page === pagination.pages}
                onClick={() => fetchOrders(pagination.page + 1)}
                className="gap-2"
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
};
