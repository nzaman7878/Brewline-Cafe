import { OrderTimeline } from './OrderTimeline';
import { Clock } from 'lucide-react';

export const OrderStatusTracker = ({ order }) => {
  const pickupDate = new Date(order.pickupTime);
  const isCompleted = ['completed', 'cancelled', 'refunded'].includes(order.status);
  
  // Calculate estimated time remaining
  const now = new Date();
  const diffMs = pickupDate - now;
  const diffMins = Math.round(diffMs / 60000);
  
  let timeDisplay = '';
  if (isCompleted) {
    timeDisplay = 'Order Finished';
  } else if (order.status === 'ready_for_pickup') {
    timeDisplay = 'Ready Now!';
  } else if (diffMins > 0) {
    timeDisplay = `~${diffMins} min${diffMins !== 1 ? 's' : ''}`;
  } else {
    timeDisplay = 'Almost ready';
  }

  return (
    <div className="bg-surface rounded-card border border-outline p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-outline pb-6 gap-4">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Order Tracker</h2>
          <p className="text-on-surface-variant font-mono text-sm mt-1">ID: ...{order._id.slice(-8)}</p>
        </div>
        
        <div className="flex items-center gap-3 bg-surface-variant px-4 py-2 rounded-full border border-outline/50">
          <Clock className={isCompleted ? 'text-on-surface-variant' : 'text-primary animate-pulse'} size={20} />
          <span className="font-bold text-on-surface whitespace-nowrap">
            {timeDisplay}
          </span>
        </div>
      </div>

      <OrderTimeline status={order.status} />

    </div>
  );
};
