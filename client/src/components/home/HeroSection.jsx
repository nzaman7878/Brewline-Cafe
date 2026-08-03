import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const HeroSection = () => {
  return (
    <section className="relative flex flex-col items-center justify-center text-center min-h-[85vh] px-4 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: 'url(/images/hero-bg.png)',
        }}
      />
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-neutral-dark/80 z-0 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto pt-20">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-primary font-label font-bold uppercase tracking-[0.3em] text-sm mb-4"
        >
          ☕ The Art of Coffee
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl lg:text-8xl font-headline font-extrabold text-on-surface mb-6 leading-[1.1]"
        >
          The Perfect Brew,<br />
          <span className="text-primary italic">Ready When You Are.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Order ahead, skip the line. Enjoy premium artisan coffee and fresh pastries crafted with love — your way, every time.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/menu">
            <Button size="lg" className="w-full sm:w-auto gap-2 group shadow-2xl shadow-primary/20 text-lg px-8 py-6">
              Order Now
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/track">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 border-outline text-on-surface hover:border-primary/50 hover:text-primary transition-all">
              Track Order
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
