import { Link } from 'react-router-dom';
import { ArrowRight, Coffee, Clock, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Home = () => {
  const features = [
    {
      icon: Coffee,
      title: 'Premium Roasts',
      desc: 'Single-origin beans sourced from the finest farms worldwide, roasted in-house every week.'
    },
    {
      icon: Clock,
      title: 'Order Ahead',
      desc: 'Skip the queue. Place your order online and pick it up exactly when you arrive.'
    },
    {
      icon: Star,
      title: 'Crafted with Care',
      desc: 'Every cup is prepared by our expert baristas who take pride in every detail.'
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background">

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center min-h-[80vh] px-4 overflow-hidden">
        {/* Background Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-primary font-label font-bold uppercase tracking-[0.3em] text-sm mb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            ☕ The Art of Coffee
          </p>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700">
            The Perfect Brew,<br />
            <span className="text-primary">Ready When You Are.</span>
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 animate-in fade-in slide-in-from-bottom-8 duration-900">
            Order ahead, skip the line. Enjoy premium coffee and fresh pastries crafted with love — your way, every time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <Link to="/menu">
              <Button size="lg" className="w-full sm:w-auto gap-2 group shadow-2xl shadow-primary/20">
                Order Now
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/track">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Track My Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 border-t border-outline">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-headline font-extrabold text-center text-on-surface mb-12">
            Why Choose Brewline?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-surface rounded-card border border-outline p-8 text-center hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 text-primary">
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-headline font-bold text-on-surface mb-3">{f.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-20 px-4 bg-surface border-t border-outline">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-4">
            Ready for your next cup?
          </h2>
          <p className="text-on-surface-variant mb-8">Browse our full menu and find something you'll love.</p>
          <Link to="/menu">
            <Button size="lg" className="gap-2 shadow-xl shadow-primary/20">
              Explore the Menu <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
