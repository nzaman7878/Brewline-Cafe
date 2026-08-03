import { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Receipt, ChefHat, CheckCircle2 } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { SocketContext } from '../../context/SocketContext';
import api from '../../api/axios';

import { OrderColumn } from '../../components/staff/OrderColumn';
import { NewOrderAlert } from '../../components/staff/NewOrderAlert';

export const StaffDashboard = () => {
  const { user, isLoading } = useContext(AuthContext);
  const { staffSocket } = useContext(SocketContext);
  const [orders, setOrders] = useState([]);
  const [newOrderAlert, setNewOrderAlert] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  // Initial load
  useEffect(() => {
    if (!user || !['admin', 'staff'].includes(user.role)) return;

    const fetchQueue = async () => {
      try {
        const { data } = await api.get('/staff/orders');
        setOrders(data.data);
      } catch (err) {
        console.error('Failed to fetch orders queue');
      } finally {
        setIsFetching(false);
      }
    };
    fetchQueue();
  }, [user]);

  // Real-time socket updates
  useEffect(() => {
    if (!staffSocket) return;

    const handleQueueUpdate = (updatedOrder) => {
      setOrders(prev => {
        // If completed, cancelled, or refunded, remove from active board
        if (['completed', 'cancelled', 'refunded'].includes(updatedOrder.status)) {
          return prev.filter(o => o._id !== updatedOrder._id);
        }
        
        const exists = prev.find(o => o._id === updatedOrder._id);
        if (exists) {
          // Update existing order in place
          return prev.map(o => o._id === updatedOrder._id ? updatedOrder : o);
        } else {
          // Brand new order coming in!
          if (updatedOrder.status === 'paid') {
            setNewOrderAlert(updatedOrder);
          }
          return [...prev, updatedOrder];
        }
      });
    };

    staffSocket.on('queue-updated', handleQueueUpdate);

    return () => {
      staffSocket.off('queue-updated', handleQueueUpdate);
    };
  }, [staffSocket]);

  if (isLoading) return <div className="p-8">Loading...</div>;

  // Protect route
  if (!user || !['admin', 'staff'].includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Derive column data
  const newOrders = orders.filter(o => o.status === 'paid');
  const preparingOrders = orders.filter(o => o.status === 'preparing');
  const readyOrders = orders.filter(o => o.status === 'ready_for_pickup');

  return (
    <div className="h-screen bg-background flex flex-col p-4 overflow-hidden pt-24 lg:pt-24">
      {/* Alert Portal */}
      {newOrderAlert && (
        <NewOrderAlert 
          order={newOrderAlert} 
          onDismiss={() => setNewOrderAlert(null)} 
        />
      )}

      {/* Header */}
      <div className="mb-4 flex justify-between items-center shrink-0">
        <h1 className="text-3xl font-headline font-extrabold text-on-surface">Kitchen Display</h1>
        <div className="flex items-center gap-2 text-sm">
          <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
          <span className="text-on-surface-variant font-bold">System Online</span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {isFetching ? (
          <div className="w-full flex items-center justify-center">Loading queue...</div>
        ) : (
          <>
            <OrderColumn 
              title="New Orders" 
              status="paid" 
              orders={newOrders} 
              icon={Receipt}
            />
            <OrderColumn 
              title="Preparing" 
              status="preparing" 
              orders={preparingOrders} 
              icon={ChefHat}
            />
            <OrderColumn 
              title="Ready" 
              status="ready_for_pickup" 
              orders={readyOrders} 
              icon={CheckCircle2}
            />
          </>
        )}
      </div>
    </div>
  );
};
