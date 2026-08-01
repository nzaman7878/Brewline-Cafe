import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl md:text-6xl font-headline font-bold mb-6">
        The Perfect Brew,<br />Ready When You Are.
      </h1>
      <p className="text-lg text-on-surface-variant max-w-2xl mx-auto mb-10">
        Order ahead, skip the line. Enjoy premium coffee and fresh pastries crafted with care.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link to="/menu">
          <Button size="lg" className="w-full sm:w-auto">
            Order Now
          </Button>
        </Link>
        <Link to="/track">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            Track Order
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
