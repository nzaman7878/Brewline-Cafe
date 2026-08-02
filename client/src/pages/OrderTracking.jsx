import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../../context/SocketContext';
import api from '../../api/axios';
import { OrderStatusTracker } from '../components/orders/OrderStatusTracker';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

export const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orderSocket } = useContext(SocketContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupId, setLookupId] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);

  // Fallback polling ref
  const pollingRef = useRef(null);

  const fetchOrder = async (orderId, email = null) => {
    try {
      const url = email ? `/orders/${orderId}?email=${encodeURIComponent(email)}` : `/orders/${orderId}`;
      const { data } = await api.get(url);
      setOrder(data.data);
      return data.data;
    } catch (error) {
      toast.error('Order not found or unauthorized');
      if (!email) navigate('/track'); // kick out if we failed by URL ID
      return null;
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!lookupId.trim() || !lookupEmail.trim()) return;
    setIsLookingUp(true);
    const fetchedOrder = await fetchOrder(lookupId.trim(), lookupEmail.trim());
    setIsLookingUp(false);
    
    if (fetchedOrder) {
      navigate(`/track/${fetchedOrder._id}`);
    }
  };

  // Notification API helper
  const notifyUser = (newStatus) => {
    if (!('Notification' in window)) return;
    
    if (Notification.permission === 'granted') {
      new Notification(`Brewline Cafe Order Update`, {
        body: `Your order is now: ${newStatus.replace(/_/g, ' ')}`,
        icon: '/favicon.ico'
      });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  // Ask for notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Main lifecycle for a specific order ID
  useEffect(() => {
    if (!id) {
      setOrder(null);
      setLoading(false);
      return;
    }

    let isSubscribed = true;

    const init = async () => {
      setLoading(true);
      const fetched = await fetchOrder(id);
      if (isSubscribed && fetched) {
        setLoading(false);
        
        // Setup WebSockets
        if (orderSocket && orderSocket.connected) {
          orderSocket.emit('join-order', id);
        }
      }
    };
    init();

    // Socket Event Listener
    const handleOrderUpdated = (updatedOrder) => {
      if (updatedOrder._id === id) {
        setOrder(prev => {
          if (prev && prev.status !== updatedOrder.status) {
            notifyUser(updatedOrder.status);
            toast.success(`Order status updated to: ${updatedOrder.status.replace(/_/g, ' ')}`);
          }
          return updatedOrder;
        });
      }
    };

    if (orderSocket) {
      orderSocket.on('order-updated', handleOrderUpdated);
      
      // Re-join if socket reconnects
      orderSocket.on('connect', () => {
        orderSocket.emit('join-order', id);
      });
    }

    // Fallback Polling (every 15s)
    pollingRef.current = setInterval(() => {
      fetchOrder(id);
    }, 15000);

    return () => {
      isSubscribed = false;
      clearInterval(pollingRef.current);
      if (orderSocket) {
        orderSocket.off('order-updated', handleOrderUpdated);
        orderSocket.emit('leave-order', id);
      }
    };
  }, [id, orderSocket, navigate]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Lookup View
  if (!id || !order) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-12 max-w-md">
        <div className="bg-surface rounded-card border border-outline p-8 shadow-sm">
          <h1 className="text-3xl font-headline font-extrabold text-on-surface mb-2">Track Order</h1>
          <p className="text-on-surface-variant mb-6">Enter your details to track your guest order.</p>
          
          <form onSubmit={handleLookup} className="space-y-4">
            <Input 
              label="Order ID" 
              placeholder="e.g. 64b1f... (found in email)" 
              value={lookupId} 
              onChange={e => setLookupId(e.target.value)} 
              required 
            />
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="Guest email used at checkout" 
              value={lookupEmail} 
              onChange={e => setLookupEmail(e.target.value)} 
              required 
            />
            <Button type="submit" className="w-full mt-4" isLoading={isLookingUp}>
              Find Order
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Tracking View
  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8 lg:py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">Order Status</h1>
        <p className="text-on-surface-variant">Real-time updates for your order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <OrderStatusTracker order={order} />
          
          {/* Order Details Collapsible Placeholder (Could be an actual accordion, showing flat list for now) */}
          <div className="mt-8 bg-surface rounded-card border border-outline p-6">
            <h3 className="font-headline font-bold text-lg mb-4 border-b border-outline pb-2">Order Details</h3>
            <ul className="space-y-3">
              {order.items.map(item => (
                <li key={item._id} className="flex justify-between text-sm">
                  <div>
                    <span className="font-bold text-on-surface">{item.quantity}x {item.name}</span>
                    {item.selectedOptions && Object.values(item.selectedOptions).length > 0 && (
                       <p className="text-xs text-on-surface-variant">
                         {Object.values(item.selectedOptions).flat().join(', ')}
                       </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface rounded-card border border-outline p-6">
            <h3 className="font-headline font-bold mb-2">Need help?</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              If you have any questions about your order, give us a call or ask our barista in store.
            </p>
            <Button variant="outline" className="w-full">Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
