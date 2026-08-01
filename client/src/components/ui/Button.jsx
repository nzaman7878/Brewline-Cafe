import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Button = forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  children, 
  disabled, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-body-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-dark disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-secondary border border-transparent shadow-sm",
    secondary: "bg-surface-variant text-on-surface hover:bg-surface-variant/80 border border-outline",
    ghost: "bg-transparent text-primary hover:bg-primary/10",
    danger: "bg-error text-white hover:bg-error/90",
  };

  const sizes = {
    sm: "h-9 px-3 text-sm rounded-button",
    md: "h-11 px-4 py-2 rounded-button",
    lg: "h-14 px-8 text-lg rounded-button",
    icon: "h-10 w-10 rounded-button",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button, cn };
