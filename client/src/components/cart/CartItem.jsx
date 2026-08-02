import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { QuantityStepper } from '../menu/QuantityStepper';

export const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();
  const [swipeOffset, setSwipeOffset] = useState(0);

  // Parse selected options for display
  const optionsList = Object.entries(item.selectedOptions || {}).map(([key, value]) => {
    if (Array.isArray(value) && value.length === 0) return null;
    const valString = Array.isArray(value) ? value.join(', ') : value;
    return `${valString}`;
  }).filter(Boolean);

  const handleTouchStart = (e) => {
    setSwipeOffset(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    const currentX = e.targetTouches[0].clientX;
    const diff = swipeOffset - currentX;
    // Basic threshold for swipe
    if (diff > 50) {
      removeItem(item.key);
      setSwipeOffset(0); // reset
    }
  };

  const imageUrl = item.imageUrl || 'https://source.unsplash.com/100x100/?coffee';
  const lineTotal = item.unitPrice * item.quantity;

  return (
    <div 
      className="flex gap-4 py-4 border-b border-outline bg-surface relative overflow-hidden group animate-in fade-in slide-in-from-right-4 duration-300"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <div className="w-20 h-20 bg-surface-variant rounded-badge flex-shrink-0 overflow-hidden">
        <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="font-headline font-bold text-on-surface line-clamp-1">{item.name}</h4>
            <span className="font-label font-bold text-primary ml-2">${lineTotal.toFixed(2)}</span>
          </div>
          
          {optionsList.length > 0 && (
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
              {optionsList.join(' • ')}
            </p>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <QuantityStepper 
            value={item.quantity} 
            onChange={(newVal) => updateQuantity(item.key, newVal)} 
            min={1} 
            max={10} 
          />
          <button 
            onClick={() => removeItem(item.key)}
            className="text-on-surface-variant hover:text-error transition-colors p-1"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
