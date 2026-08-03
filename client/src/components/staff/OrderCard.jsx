import { useState, useEffect } from 'react';
import { Check, ChefHat, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const OrderCard = ({ order }) => {
  const [elapsed, setElapsed] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);

  // Calculate elapsed time since order was created (in minutes)
  useEffect(() => {
    const calcElapsed = () => {
      const diffMs = Date.now() - new Date(order.createdAt).getTime();
      setElapsed(Math.floor(diffMs / 60000));
    };
    calcElapsed();
    const interval = setInterval(calcElapsed, 60000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  // Urgency color logic based on elapsed time
  let urgencyClass = 'bg-primary/10 text-primary border-primary/20';
  if (elapsed >= 10) urgencyClass = 'bg-error/10 text-error border-error/20';
  else if (elapsed >= 5) urgencyClass = 'bg-warning/10 text-warning border-warning/20';

  const handleAdvanceStatus = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    // Determine next state
    let nextStatus = '';
    if (order.status === 'paid') nextStatus = 'preparing';
    else if (order.status === 'preparing') nextStatus = 'ready_for_pickup';
    else if (order.status === 'ready_for_pickup') nextStatus = 'completed';

    try {
      await api.put(`/staff/orders/${order._id}/status`, { status: nextStatus });
      // Note: We don't need to manually update local state because the socket `queue-updated` 
      // event will fire and update the parent StaffDashboard state globally!
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
      setIsUpdating(false);
    }
  };

  const pickupDate = new Date(order.pickupTime);

  return (
    <div className="bg-surface rounded-md border border-outline p-4 shadow-sm flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-outline pb-2">
        <div>
          <span className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">Order</span>
          <p className="font-mono font-bold text-on-surface">...{order._id.slice(-6)}</p>
        </div>
        <div className={`px-2 py-1 rounded-md text-xs font-bold border ${urgencyClass}`}>
          {elapsed} min
        </div>
      </div>

      {/* Guest Name & Pickup */}
      <div className="flex justify-between text-sm">
        <span className="text-on-surface font-bold">{order.guestName || 'Guest'}</span>
        <span className="text-on-surface-variant font-mono">
          Pick up: {pickupDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Items List */}
      <ul className="space-y-2 mt-1">
        {order.items.map(item => (
          <li key={item._id} className="text-sm border-l-2 border-primary/30 pl-2">
            <span className="font-bold text-on-surface">{item.quantity}x {item.name}</span>
            {item.selectedOptions && Object.values(item.selectedOptions).length > 0 && (
              <p className="text-xs text-on-surface-variant mt-0.5 leading-tight">
                {Object.values(item.selectedOptions).flat().join(', ')}
              </p>
            )}
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <div className="pt-2 mt-auto">
        <Button 
          onClick={handleAdvanceStatus} 
          isLoading={isUpdating}
          className="w-full justify-center flex items-center gap-2"
          variant={order.status === 'ready_for_pickup' ? 'outline' : 'primary'}
        >
          {order.status === 'paid' && <><Play size={16} /> Mark Preparing</>}
          {order.status === 'preparing' && <><ChefHat size={16} /> Mark Ready</>}
          {order.status === 'ready_for_pickup' && <><Check size={16} /> Mark Completed</>}
        </Button>
      </div>
    </div>
  );
};
