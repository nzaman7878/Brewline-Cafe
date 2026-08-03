import { Link } from 'react-router-dom';
import { Coffee, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const NotFound = () => (
  <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
    <Coffee size={64} className="text-primary mb-6 opacity-50" />
    <h1 className="text-7xl font-headline font-extrabold text-primary mb-2">404</h1>
    <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">Page Not Found</h2>
    <p className="text-on-surface-variant max-w-md mb-8">
      Looks like this page went missing, just like our last batch of croissants. Let's get you back on track.
    </p>
    <Link to="/">
      <Button className="gap-2">
        Go Home <ArrowRight size={18} />
      </Button>
    </Link>
  </div>
);
