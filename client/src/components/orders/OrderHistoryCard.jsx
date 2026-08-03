import { useState } from 'react';
import { ChevronDown, ChevronUp, Coffee } from 'lucide-react';
import { ReorderButton } from './ReorderButton';

export const OrderHistoryCard = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending_payment': return 'bg-warning/10 text-warning border-warning/20';
      case 'paid': return 'bg-info/10 text-info border-info/20';
      case 'preparing': return 'bg-primary/10 text-primary border-primary/20';
      case 'ready_for_pickup': return 'bg-success/10 text-success border-success/20';
      case 'completed': return 'bg-surface-variant text-on-surface border-outline';
      case 'cancelled': 
      case 'refunded': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-surface-variant text-on-surface border-outline';
    }
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString(undefined, {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
  });
  const formattedTime = new Date(order.createdAt).toLocaleTimeString(undefined, {
    hour: 'numeric', minute: '2-digit'
  });

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-surface rounded-card border border-outline overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-md">
      
      {/* Header (Always Visible) */}
      <div 
        className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex gap-4 items-center">
          <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center shrink-0 text-primary">
            <Coffee size={24} />
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-on-surface">{formattedDate}</h3>
            <p className="text-sm text-on-surface-variant">
              {formattedTime} &bull; {itemCount} item{itemCount !== 1 ? 's' : ''} &bull; Total: ${order.total.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <span className={`px-3 py-1 text-xs uppercase font-bold tracking-wider rounded-full border ${getStatusColor(order.status)}`}>
            {order.status.replace(/_/g, ' ')}
          </span>
          {isExpanded ? <ChevronUp size={20} className="text-on-surface-variant" /> : <ChevronDown size={20} className="text-on-surface-variant" />}
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-outline/50 animate-in slide-in-from-top-2 duration-200">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            <div>
              <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Order Details</h4>
              <ul className="space-y-3">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm">
                    <span className="font-bold text-primary">{item.quantity}x</span>
                    <div className="flex-1">
                      <p className="font-bold text-on-surface">{item.name}</p>
                      {item.selectedOptions && Object.entries(item.selectedOptions).map(([group, opt]) => (
                        <p key={group} className="text-xs text-on-surface-variant">- {opt.name || opt}</p>
                      ))}
                    </div>
                    <span className="font-mono text-on-surface-variant">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Summary</h4>
                <div className="bg-surface-variant/30 rounded-md p-3 text-sm space-y-1">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Subtotal</span>
                    <span>${order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount ({order.promoCode})</span>
                      <span>-${order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Tax</span>
                    <span>${order.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-outline mt-2 text-on-surface">
                    <span>Total</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-2">
                <ReorderButton orderItems={order.items} />
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
