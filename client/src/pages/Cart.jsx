import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../components/cart/CartItem';
import { Button } from '../components/ui/Button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const Cart = () => {
  const { items, cartSubtotal, cartItemCount } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // navigate('/checkout'); // Phase 19 Checkout Integration
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center container mx-auto px-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 mx-auto bg-surface-variant rounded-full flex items-center justify-center text-on-surface-variant mb-8">
            <ShoppingBag size={56} />
          </div>
          <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-4">Your cart is empty</h2>
          <p className="text-on-surface-variant mb-8 text-lg">
            Looks like you haven't added any delicious brews yet. Check out our menu to find your new favorite drink.
          </p>
          <Button onClick={() => navigate('/menu')} size="lg" className="w-full sm:w-auto">
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-headline font-extrabold mb-8 flex items-center gap-3">
        Review Your Order
        <span className="bg-primary/20 text-primary text-xl px-3 py-1 rounded-badge">
          {cartItemCount} items
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="bg-surface rounded-card border border-outline p-2 sm:p-6 shadow-sm">
            {items.map(item => (
              <CartItem key={item.key} item={item} />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-96">
          <div className="bg-surface rounded-card border border-outline p-6 shadow-sm sticky top-24">
            <h2 className="text-2xl font-headline font-bold mb-6 pb-4 border-b border-outline">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span>${cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Tax (Estimated)</span>
                <span>${(cartSubtotal * 0.08).toFixed(2)}</span>
              </div>
              
              <div className="pt-4 border-t border-outline flex justify-between font-bold text-xl text-on-surface">
                <span>Total</span>
                <span className="text-primary">${(cartSubtotal * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={handleCheckout} className="w-full py-4 text-lg shadow-xl group">
              Proceed to Checkout
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="mt-4 text-center">
              <button 
                onClick={() => navigate('/menu')}
                className="text-on-surface-variant hover:text-primary font-body-bold transition-colors"
              >
                Add more items
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
