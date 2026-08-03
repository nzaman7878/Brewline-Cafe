import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee } from 'lucide-react';
import api from '../../../api/axios';
import { Button } from '../ui/Button';

export const FeaturedItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await api.get('/menu');
        // Just grab the first 4 items as "featured"
        setItems(data.data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch featured items', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface mb-4">
              Brewed to <span className="text-primary italic">Perfection</span>
            </h2>
            <p className="text-on-surface-variant text-lg max-w-xl">
              Explore our most loved signature roasts and handcrafted pastries.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/menu">
              <Button variant="ghost" className="gap-2 text-primary hover:bg-primary/10">
                View Full Menu <ArrowRight size={20} />
              </Button>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse bg-surface h-80 rounded-card border border-outline" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col bg-surface rounded-card overflow-hidden border border-outline hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-surface-variant/30 flex items-center justify-center">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <Coffee size={48} className="text-on-surface-variant opacity-20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6 flex flex-col grow">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">
                    {item.category}
                  </span>
                  <h3 className="font-headline font-bold text-xl text-on-surface mb-2 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 grow">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold text-lg text-on-surface">${item.price.toFixed(2)}</span>
                    <Link to={`/menu`}>
                      <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
                        <ArrowRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
