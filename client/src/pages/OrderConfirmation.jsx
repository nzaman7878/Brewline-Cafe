import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Clock, MapPin, Search } from 'lucide-react';
import api from '../api/axios';
import { Button } from '../components/ui/Button';

export const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data);
      } catch (error) {
        console.error('Failed to fetch order', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Search size={64} className="text-on-surface-variant mb-4" />
        <h2 className="text-2xl font-headline font-bold text-on-surface mb-2">Order Not Found</h2>
        <p className="text-on-surface-variant mb-6">We couldn't find the order you're looking for.</p>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  const pickupDate = new Date(order.pickupTime);

  return (
    <div className="min-h-screen container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-surface rounded-card border border-outline p-8 md:p-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Success Animation Placeholder */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/20 text-primary rounded-full mb-6">
          <CheckCircle size={48} />
        </div>
        
        <h1 className="text-4xl font-headline font-extrabold text-on-surface mb-2">Order Confirmed!</h1>
        <p className="text-lg text-on-surface-variant mb-8">
          Thanks for your order, {order.guestName || 'friend'}! We're preparing it fresh for you.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-surface-variant rounded-md p-4 flex flex-col items-center justify-center">
            <span className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Order #</span>
            <span className="font-mono font-bold text-primary truncate w-full" title={order._id}>
              ...{order._id.slice(-6)}
            </span>
          </div>
          <div className="bg-surface-variant rounded-md p-4 flex flex-col items-center justify-center">
            <Clock className="text-on-surface-variant mb-2" size={20} />
            <span className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Pickup Time</span>
            <span className="font-bold text-on-surface">
              {pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <div className="bg-surface-variant rounded-md p-4 flex flex-col items-center justify-center">
            <MapPin className="text-on-surface-variant mb-2" size={20} />
            <span className="text-sm text-on-surface-variant font-bold uppercase tracking-wider mb-1">Location</span>
            <span className="font-bold text-on-surface">Brewline Cafe</span>
          </div>
        </div>

        {/* Items Summary */}
        <div className="text-left mb-8 border-t border-b border-outline py-6">
          <h3 className="font-headline font-bold text-xl mb-4">What you ordered</h3>
          <ul className="space-y-4">
            {order.items.map(item => (
              <li key={item._id} className="flex justify-between">
                <div>
                  <span className="font-bold text-on-surface">{item.quantity}x {item.name}</span>
                  {item.selectedOptions && Object.values(item.selectedOptions).length > 0 && (
                     <p className="text-sm text-on-surface-variant">
                       {Object.values(item.selectedOptions).flat().join(', ')}
                     </p>
                  )}
                </div>
                <span className="font-bold text-on-surface">${(item.unitPrice * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-4 border-t border-outline flex justify-between font-bold text-lg">
            <span>Total Paid</span>
            <span className="text-primary">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="w-full sm:w-auto shadow-lg">
            Track Order Status
          </Button>
          <Link to="/menu" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              Back to Menu
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};
