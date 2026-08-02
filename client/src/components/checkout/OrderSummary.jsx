import { useCart } from '../../hooks/useCart';

export const OrderSummary = ({ discountAmount, taxRate = 0.08875 }) => {
  const { items, cartSubtotal } = useCart();
  
  const subtotal = cartSubtotal;
  const afterDiscount = Math.max(0, subtotal - (discountAmount || 0));
  const taxAmount = afterDiscount * taxRate;
  const total = afterDiscount + taxAmount;

  return (
    <div className="bg-surface rounded-card border border-outline p-6 shadow-sm sticky top-24">
      <h2 className="text-2xl font-headline font-bold mb-6 pb-4 border-b border-outline">Order Summary</h2>
      
      <div className="space-y-4 mb-6 max-h-60 overflow-y-auto no-scrollbar pr-2">
        {items.map(item => (
          <div key={item.key} className="flex justify-between items-start text-sm">
            <div className="flex gap-3 flex-1">
              <span className="text-on-surface-variant font-bold">{item.quantity}x</span>
              <div>
                <p className="text-on-surface font-bold">{item.name}</p>
                {item.selectedOptions && Object.values(item.selectedOptions).length > 0 && (
                  <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-1">
                    {Object.values(item.selectedOptions).flat().join(', ')}
                  </p>
                )}
              </div>
            </div>
            <span className="text-on-surface font-bold whitespace-nowrap ml-4">
              ${(item.unitPrice * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
      
      <div className="space-y-3 pt-4 border-t border-outline text-sm">
        <div className="flex justify-between text-on-surface-variant">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-primary font-bold">
            <span>Discount</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-on-surface-variant">
          <span>Tax (Estimated)</span>
          <span>${taxAmount.toFixed(2)}</span>
        </div>
        
        <div className="pt-4 mt-2 border-t border-outline flex justify-between font-bold text-xl text-on-surface">
          <span>Total</span>
          <span className="text-primary">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
