import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './Button';

export const Modal = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className={cn(
          "relative w-full max-w-lg bg-surface rounded-modal border border-outline shadow-xl animate-in fade-in zoom-in-95 duration-200",
          className
        )}
      >
        <div className="flex items-center justify-between p-6 border-b border-outline">
          <h2 className="text-xl font-headline font-semibold">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-2 hover:bg-surface-variant transition-colors text-on-surface-variant hover:text-on-surface"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
