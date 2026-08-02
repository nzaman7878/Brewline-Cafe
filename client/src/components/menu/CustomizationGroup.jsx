import { cn } from '../ui/Button';

export const CustomizationGroup = ({ customization, selectedValues, onChange }) => {
  const { name, required, options } = customization;

  const handleRadioChange = (optionName) => {
    // For single select, selectedValues is a string
    onChange(name, optionName);
  };

  const handleCheckboxChange = (optionName) => {
    // For multi select, selectedValues is an array
    const current = Array.isArray(selectedValues) ? selectedValues : [];
    if (current.includes(optionName)) {
      onChange(name, current.filter(val => val !== optionName));
    } else {
      onChange(name, [...current, optionName]);
    }
  };

  return (
    <div className="py-4 border-b border-outline last:border-b-0">
      <div className="flex justify-between items-baseline mb-3">
        <h4 className="font-headline font-bold text-on-surface text-lg">{name}</h4>
        {required ? (
          <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Required</span>
        ) : (
          <span className="text-on-surface-variant text-sm">Optional</span>
        )}
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const priceDisplay = option.priceAdjustment > 0 ? `+$${option.priceAdjustment.toFixed(2)}` : '';
          
          if (required) {
            // Radio Button Style
            const isSelected = selectedValues === option.name;
            return (
              <label 
                key={option.name} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-card border cursor-pointer transition-colors",
                  isSelected 
                    ? "border-primary bg-primary/10" 
                    : "border-outline hover:border-primary/50 bg-surface"
                )}
              >
                <div className="flex items-center">
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3",
                    isSelected ? "border-primary" : "border-on-surface-variant"
                  )}>
                    {isSelected && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                  </div>
                  <span className="text-on-surface">{option.name}</span>
                </div>
                {priceDisplay && <span className="text-on-surface-variant font-label text-sm">{priceDisplay}</span>}
                <input 
                  type="radio" 
                  name={name} 
                  value={option.name}
                  checked={isSelected}
                  onChange={() => handleRadioChange(option.name)}
                  className="hidden"
                />
              </label>
            );
          } else {
            // Checkbox Style
            const isSelected = Array.isArray(selectedValues) && selectedValues.includes(option.name);
            return (
              <label 
                key={option.name} 
                className={cn(
                  "flex items-center justify-between p-3 rounded-card border cursor-pointer transition-colors",
                  isSelected 
                    ? "border-primary bg-primary/10" 
                    : "border-outline hover:border-primary/50 bg-surface"
                )}
              >
                <div className="flex items-center">
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center mr-3 transition-colors",
                    isSelected ? "border-primary bg-primary" : "border-on-surface-variant"
                  )}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-on-surface">{option.name}</span>
                </div>
                {priceDisplay && <span className="text-on-surface-variant font-label text-sm">{priceDisplay}</span>}
                <input 
                  type="checkbox" 
                  name={name} 
                  value={option.name}
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(option.name)}
                  className="hidden"
                />
              </label>
            );
          }
        })}
      </div>
    </div>
  );
};
