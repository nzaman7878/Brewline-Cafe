import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ShoppingBag, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';
import { CartDrawer } from '../cart/CartDrawer';
import { AuthContext } from '../../context/AuthContext';
import { useContext } from 'react';

export const Navbar = () => {
  const { cartItemCount } = useCart();
  const { user, isAuthenticated, logout } = useContext(AuthContext);
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
            {isAuthenticated ? (
              <div className="relative group">
                <Button variant="ghost" size="icon" className="peer">
                  <User size={20} className="text-primary" />
                </Button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-outline rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-outline">
                    <p className="text-sm font-bold text-on-surface truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                  <div className="py-2 flex flex-col">
                    <Link to="/orders" className="px-4 py-2 text-sm text-on-surface hover:bg-surface-variant transition-colors">
                      Order History
                    </Link>
                    <Link to="/profile" className="px-4 py-2 text-sm text-on-surface hover:bg-surface-variant transition-colors">
                      Profile Settings
                    </Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin/overview" className="px-4 py-2 text-sm text-primary hover:bg-surface-variant transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    {['staff', 'admin'].includes(user?.role) && (
                      <Link to="/staff" className="px-4 py-2 text-sm text-info hover:bg-surface-variant transition-colors">
                        Staff Dashboard
                      </Link>
                    )}
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/10 transition-colors mt-2 border-t border-outline">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Button variant="ghost" size="icon" onClick={() => window.location.href = '/login'}>
                <User size={20} />
              </Button>
            )}
          </div>
        </div>
      </nav>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
