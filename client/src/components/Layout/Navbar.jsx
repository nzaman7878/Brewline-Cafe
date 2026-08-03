import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Coffee, ShoppingBag, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';
import { CartDrawer } from '../cart/CartDrawer';
import { AuthContext } from '../../context/AuthContext';

export const Navbar = () => {
  const { cartItemCount } = useCart();
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { label: 'Menu', to: '/menu' },
    { label: 'Track Order', to: '/track' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-outline bg-neutral-dark/90 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary shrink-0">
            <Coffee size={26} />
            <span className="font-headline text-xl font-bold text-on-surface">Brewline</span>
          </Link>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <NavLink 
                key={link.to}
                to={link.to} 
                className={({ isActive }) => 
                  `text-sm font-bold transition-colors ${isActive ? 'text-primary' : 'text-on-surface hover:text-primary'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            
            {/* Cart Button */}
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-primary text-on-primary text-[10px] font-bold rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* User Menu (Desktop) */}
            {isAuthenticated ? (
              <div className="relative group hidden md:block">
                <Button variant="ghost" size="icon" className="peer">
                  <User size={20} className="text-primary" />
                </Button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-surface border border-outline rounded-card shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-3 border-b border-outline">
                    <p className="text-sm font-bold text-on-surface truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                  <div className="py-1 flex flex-col">
                    <Link to="/orders" className="px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant transition-colors">Order History</Link>
                    <Link to="/profile" className="px-4 py-2.5 text-sm text-on-surface hover:bg-surface-variant transition-colors">Profile Settings</Link>
                    {user?.role === 'admin' && (
                      <Link to="/admin/overview" className="px-4 py-2.5 text-sm text-primary font-bold hover:bg-surface-variant transition-colors">
                        Admin Dashboard
                      </Link>
                    )}
                    {['staff', 'admin'].includes(user?.role) && (
                      <Link to="/staff/dashboard" className="px-4 py-2.5 text-sm text-info font-bold hover:bg-surface-variant transition-colors">
                        Staff Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-error hover:bg-error/10 transition-colors border-t border-outline mt-1">
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block">
                <Button variant="ghost" size="icon">
                  <User size={20} />
                </Button>
              </Link>
            )}

            {/* Mobile Hamburger */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </Button>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-outline bg-surface animate-in slide-in-from-top-2 duration-200 pb-4">
            <div className="flex flex-col">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 text-sm font-bold text-on-surface hover:bg-surface-variant border-b border-outline/50">
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  <div className="px-6 py-3 border-b border-outline/50 bg-surface-variant/30">
                    <p className="text-sm font-bold text-on-surface">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-on-surface-variant">{user?.email}</p>
                  </div>
                  <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 text-sm text-on-surface hover:bg-surface-variant border-b border-outline/50">Order History</Link>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 text-sm text-on-surface hover:bg-surface-variant border-b border-outline/50">Profile Settings</Link>
                  {user?.role === 'admin' && <Link to="/admin/overview" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 text-sm text-primary font-bold hover:bg-surface-variant border-b border-outline/50">Admin Dashboard</Link>}
                  {['staff', 'admin'].includes(user?.role) && <Link to="/staff/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 text-sm text-info font-bold hover:bg-surface-variant border-b border-outline/50">Staff Dashboard</Link>}
                  <button onClick={handleLogout} className="px-6 py-3.5 text-left text-sm text-error font-bold hover:bg-error/10">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 text-sm font-bold text-on-surface hover:bg-surface-variant border-b border-outline/50">Sign In</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-3.5 text-sm font-bold text-primary hover:bg-surface-variant">Create Account</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
