import { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../ui/Button';

export const NewOrderAlert = ({ order, onDismiss }) => {
  useEffect(() => {
    // Play a subtle notification sound when this mounts
    try {
      const audio = new Audio('/notification.mp3'); // We can add an mp3 later or assume browser default beep
      audio.play().catch(() => {}); // catch autoplay blocks
    } catch (e) {}
    
    // Auto dismiss after 10 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 10000);
    
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!order) return null;

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-10 fade-in duration-300">
      <div className="bg-primary text-on-primary px-6 py-4 rounded-full shadow-2xl flex items-center gap-4">
        <Bell size={20} className="animate-bounce" />
        <span className="font-bold">
          New Order Received! (...{order._id.slice(-6)})
        </span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onDismiss} 
          className="border-on-primary text-on-primary hover:bg-on-primary hover:text-primary ml-2 rounded-full px-3 py-1 text-xs"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};
