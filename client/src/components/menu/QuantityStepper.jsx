import { Minus, Plus } from 'lucide-react';

export const QuantityStepper = ({ value, onChange, min = 1, max = 10 }) => {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center space-x-4 bg-surface-variant rounded-badge px-2 py-1">
      <button
        onClick={handleDecrease}
        disabled={value <= min}
        className="p-2 text-on-surface hover:text-primary disabled:opacity-50 transition-colors focus:outline-none"
      >
        <Minus size={18} />
      </button>
      <span className="font-label font-bold text-lg w-6 text-center">{value}</span>
      <button
        onClick={handleIncrease}
        disabled={value >= max}
        className="p-2 text-on-surface hover:text-primary disabled:opacity-50 transition-colors focus:outline-none"
      >
        <Plus size={18} />
      </button>
    </div>
  );
};
