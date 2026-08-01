import { Link } from 'react-router-dom';
import { Coffee, ShoppingBag, User } from 'lucide-react';
import { Button } from '../ui/Button';

export const Navbar = () => {
  return (
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
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingBag size={20} />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full"></span>
          </Button>
          <Button variant="ghost" size="icon">
            <User size={20} />
          </Button>
        </div>
      </div>
    </nav>
  );
};
