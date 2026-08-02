import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ShoppingBag, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';
import { CartDrawer } from '../cart/CartDrawer';

export const Navbar = () => {
  const { cartItemCount } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-outline bg-neutral-dark/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Coffee size={28} />
            <span className="font-headline text-xl font-bold text-on-surface">Brewline</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/menu" className="text-on-surface hover:text-primary transition-colors font-body-bold">
              Menu
            </Link>
            <Link to="/about" className="text-on-surface hover:text-primary transition-colors font-body-bold">
              Our Story
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-primary text-on-primary text-[10px] font-bold rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {cartItemCount}
                </span>
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <User size={20} />
            </Button>
          </div>
        </div>
      </nav>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
