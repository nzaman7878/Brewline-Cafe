import { useState, useEffect, useMemo } from 'react';
import { X, Info } from 'lucide-react';
import { Button } from '../ui/Button';
import { QuantityStepper } from './QuantityStepper';
import { CustomizationGroup } from './CustomizationGroup';
import toast from 'react-hot-toast';

export const ItemDetail = ({ isOpen, onClose, item, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  // Reset state when a new item is opened
  useEffect(() => {
    if (item && isOpen) {
      setQuantity(1);
      
      // Initialize default selections (first option for required single-selects, empty array for multi-selects)
      const initialSelections = {};
      item.customizations?.forEach(group => {
        if (group.required) {
          initialSelections[group.name] = group.options[0]?.name;
        } else {
          initialSelections[group.name] = [];
        }
      });
      setSelectedOptions(initialSelections);
    }
  }, [item, isOpen]);

  // Calculate live total price
  const totalPrice = useMemo(() => {
    if (!item) return 0;
    
    let totalAdjustment = 0;
    
    item.customizations?.forEach(group => {
      const selection = selectedOptions[group.name];
      if (!selection) return;

      if (Array.isArray(selection)) {
        // Multi-select
        selection.forEach(selectedName => {
          const option = group.options.find(o => o.name === selectedName);
          if (option) totalAdjustment += option.priceAdjustment;
        });
      } else {
        // Single-select
        const option = group.options.find(o => o.name === selection);
        if (option) totalAdjustment += option.priceAdjustment;
      }
    });

    return (item.price + totalAdjustment) * quantity;
  }, [item, selectedOptions, quantity]);

  const handleCustomizationChange = (groupName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [groupName]: value
    }));
  };

  const handleAddToCart = () => {
    // Phase 15/16: Actually add to cart context
    const cartItem = {
      menuItem: item,
      quantity,
      selectedOptions,
      totalPrice
    };
    
    // Fake adding to cart for now
    if (onAddToCart) onAddToCart(cartItem);
    toast.success(`Added ${quantity} ${item.name} to cart`);
    onClose();
  };

  if (!isOpen || !item) return null;

  const imageUrl = item.image || `https://source.unsplash.com/800x600/?${encodeURIComponent(item.category.toLowerCase() + ' coffee cafe')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-neutral-dark/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-surface rounded-card shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header / Hero Image */}
        <div className="relative h-64 sm:h-72 w-full bg-surface-variant flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover"
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-neutral-dark/50 hover:bg-neutral-dark text-white rounded-full backdrop-blur-md transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar">
          <div className="mb-6">
            <h2 className="text-3xl font-headline font-extrabold text-on-surface mb-2">{item.name}</h2>
            <p className="text-on-surface-variant text-base leading-relaxed mb-4">{item.description}</p>
            
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-variant text-on-surface-variant rounded-badge text-xs font-label uppercase">
                <Info size={14} /> Allergen Info
              </span>
              <span className="inline-flex px-3 py-1 bg-surface-variant text-on-surface-variant rounded-badge text-xs font-label uppercase">
                {item.category}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {item.customizations?.map((group) => (
              <CustomizationGroup 
                key={group.name}
                customization={group}
                selectedValues={selectedOptions[group.name]}
                onChange={handleCustomizationChange}
              />
            ))}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-outline bg-surface p-4 md:p-6 flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <QuantityStepper 
              value={quantity} 
              onChange={setQuantity} 
              min={1} 
              max={10} 
            />
            <Button 
              className="flex-1 w-full flex justify-between items-center py-4 text-lg shadow-xl"
              onClick={handleAddToCart}
            >
              <span>Add to Order</span>
              <span className="font-bold tracking-wide">${totalPrice.toFixed(2)}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
