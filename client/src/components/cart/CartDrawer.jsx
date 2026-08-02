import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { CartItem } from './CartItem';
import { Button } from '../ui/Button';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { items, cartSubtotal, cartItemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    // Phase 17/19 routing to checkout
    navigate('/cart');
  };

  const handleBrowse = () => {
    onClose();
    navigate('/menu');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-dark/80 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={onClose}
      />
      
      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-surface h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <h2 className="text-2xl font-headline font-extrabold flex items-center gap-2 text-on-surface">
            Your Cart
            {cartItemCount > 0 && (
              <span className="bg-primary/20 text-primary text-sm px-2 py-0.5 rounded-badge">
                {cartItemCount}
              </span>
            )}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-24 h-24 bg-surface-variant rounded-full flex items-center justify-center text-on-surface-variant mb-4">
                <ShoppingBag size={40} />
              </div>
              <h3 className="text-xl font-headline font-bold text-on-surface">Your cart is empty</h3>
              <p className="text-on-surface-variant">Looks like you haven't added any delicious brews yet.</p>
              <Button onClick={handleBrowse} className="mt-4">
                Browse Menu
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {items.map(item => (
                <CartItem key={item.key} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-outline bg-surface">
            <div className="flex justify-between items-center mb-6 text-lg">
              <span className="font-body-bold text-on-surface">Subtotal</span>
              <span className="font-label font-bold text-primary">${cartSubtotal.toFixed(2)}</span>
            </div>
            
            <div className="space-y-3">
              <Button onClick={handleCheckout} className="w-full py-4 text-lg shadow-xl group">
                Proceed to Checkout
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <button 
                onClick={handleBrowse}
                className="w-full py-3 text-on-surface-variant hover:text-on-surface font-body-bold transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
