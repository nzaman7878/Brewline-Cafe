import { Loader2 } from 'lucide-react';
import { cn } from './Button';

export const Spinner = ({ className, size = 24 }) => {
  return (
    <Loader2 
      size={size} 
      className={cn("animate-spin text-primary", className)} 
    />
  );
};
