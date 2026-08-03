import { useState } from 'react';
import { ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const AvailabilityToggle = ({ item, onOptimisticUpdate }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    // Optimistic UI update
    onOptimisticUpdate({ ...item, isAvailable: !item.isAvailable });
    
    try {
      await api.put(`/staff/menu/${item._id}/availability`);
      // The socket event will fire shortly to confirm and sync globally
    } catch (err) {
      toast.error(`Failed to update ${item.name}`);
      // Revert optimistic update
      onOptimisticUpdate(item);
    } finally {
      setIsLoading(false);
    }
  };

  const isSoldOut = !item.isAvailable;

  return (
    <div className={`p-4 rounded-card border transition-all duration-300 flex flex-col gap-3
      ${isSoldOut ? 'bg-error/5 border-error/30' : 'bg-surface border-outline hover:border-primary/30'}
    `}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className={`font-headline font-bold line-clamp-1 ${isSoldOut ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>
            {item.name}
          </h3>
          <p className="text-xs font-mono text-on-surface-variant mt-1 uppercase tracking-wider">{item.category}</p>
        </div>
        
        <button 
          onClick={handleToggle} 
          disabled={isLoading}
          className="shrink-0 focus:outline-none"
          title={isSoldOut ? 'Mark Available' : 'Mark Sold Out (86)'}
        >
          {isLoading ? (
             <Loader2 size={32} className="animate-spin text-primary" />
          ) : isSoldOut ? (
             <ToggleLeft size={32} className="text-error" />
          ) : (
             <ToggleRight size={32} className="text-success" />
          )}
        </button>
      </div>
      
      <div className="mt-auto pt-2">
        {isSoldOut ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-error/10 text-error uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
            Sold Out (86'd)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-success/10 text-success">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            Available
          </span>
        )}
      </div>
    </div>
  );
};
