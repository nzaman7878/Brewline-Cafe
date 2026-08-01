import { forwardRef } from 'react';
import { cn } from './Button';

const Input = forwardRef(({ className, type = "text", error, ...props }, ref) => {
  return (
    <div className="w-full">
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-input border border-outline bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          error && "border-error focus-visible:ring-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export { Input };
