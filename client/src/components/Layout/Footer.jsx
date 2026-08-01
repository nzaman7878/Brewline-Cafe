import { Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-outline bg-surface py-12 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-primary mb-4">
            <Coffee size={24} />
            <span className="font-headline text-lg font-bold text-on-surface">Brewline Cafe</span>
          </Link>
          <p className="text-on-surface-variant max-w-sm">
            Premium coffee and fast-casual dining. Order online, skip the line, and enjoy your perfect brew.
          </p>
        </div>
        
        <div>
          <h4 className="font-body-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-on-surface-variant">
            <li><Link to="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
            <li><Link to="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
            <li><Link to="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-body-bold mb-4">Contact</h4>
          <ul className="space-y-2 text-on-surface-variant text-sm">
            <li>123 Coffee Street</li>
            <li>New York, NY 10001</li>
            <li>hello@brewlinecafe.com</li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-outline flex flex-col md:flex-row items-center justify-between text-xs text-on-surface-variant">
        <p>&copy; {new Date().getFullYear()} Brewline Cafe. All rights reserved.</p>
        <div className="flex gap-4 mt-4 md:mt-0">
          <Link to="/privacy" className="hover:text-on-surface">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-on-surface">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};
