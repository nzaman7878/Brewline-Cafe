import { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../ui/Button';

export const MenuItemCard = ({ item }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const imageRef = useRef(null);
  
  // Use a placeholder image based on category if none provided
  const imageUrl = item.image || `https://source.unsplash.com/400x300/?${encodeURIComponent(item.category.toLowerCase() + ' coffee cafe')}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <div className="group flex flex-col bg-surface rounded-card border border-outline overflow-hidden hover:shadow-lg transition-all duration-300 animate-in fade-in zoom-in-95 fill-mode-both">
      <div 
        ref={imageRef} 
        className="relative w-full aspect-[4/3] bg-surface-variant overflow-hidden"
      >
        {isVisible && (
          <img
            src={imageUrl}
            alt={item.name}
            className={`w-full h-full object-cover transition-opacity duration-500 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsImageLoaded(true)}
          />
        )}
        
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-neutral-dark/70 flex items-center justify-center backdrop-blur-sm z-10">
            <span className="px-4 py-1.5 bg-error text-white font-label font-bold tracking-widest uppercase rounded-badge shadow-lg transform -rotate-12 border-2 border-white/20">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-headline font-bold text-lg text-on-surface line-clamp-1">{item.name}</h3>
          <span className="font-label font-semibold text-primary ml-4">${item.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 flex-1">
          {item.description}
        </p>

        <Button 
          variant={item.isAvailable ? 'primary' : 'secondary'} 
          className="w-full mt-auto"
          disabled={!item.isAvailable}
          // onClick={() => {}} // Phase 14: Add to cart modal
        >
          {item.isAvailable ? (
            <>
              <Plus size={18} className="mr-2" />
              Add to Order
            </>
          ) : (
            'Sold Out'
          )}
        </Button>
      </div>
    </div>
  );
};

export const MenuItemSkeleton = () => {
  return (
    <div className="flex flex-col bg-surface rounded-card border border-outline overflow-hidden animate-pulse">
      <div className="w-full aspect-[4/3] bg-surface-variant"></div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <div className="h-6 bg-surface-variant rounded w-2/3"></div>
          <div className="h-6 bg-surface-variant rounded w-1/4"></div>
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-surface-variant rounded w-full"></div>
          <div className="h-4 bg-surface-variant rounded w-4/5"></div>
        </div>
        <div className="h-11 bg-surface-variant rounded-button w-full mt-auto"></div>
      </div>
    </div>
  );
};
