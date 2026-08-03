import { useState, useContext } from 'react';
import { RotateCcw, AlertTriangle, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../api/axios';
import { CartContext } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const ReorderButton = ({ orderItems, className }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const { addItem, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const handleReorderClick = async () => {
    setIsChecking(true);
    try {
      const { data } = await api.get('/menu');
      const currentMenu = data.data;

      const result = {
        validItems: [],
        removedItems: [],
        priceChanges: [],
        unavailableItems: []
      };

      for (const oldItem of orderItems) {
        const currentItem = currentMenu.find(m => m._id === oldItem.menuItemId);
        
        if (!currentItem) {
          result.removedItems.push(oldItem.name);
          continue;
        }

        if (!currentItem.isAvailable) {
          result.unavailableItems.push(oldItem.name);
          continue;
        }

        // Calculate current price
        let currentPrice = currentItem.price;
        let optionsValid = true;

        if (oldItem.selectedOptions) {
          for (const [groupName, optionValue] of Object.entries(oldItem.selectedOptions)) {
            const customGroup = currentItem.customizations?.find(c => c.name === groupName);
            if (!customGroup) { optionsValid = false; break; }
            
            const values = Array.isArray(optionValue) ? optionValue : [optionValue];
            for (const val of values) {
              const customOption = customGroup.options?.find(o => o.name === val);
              if (!customOption) { optionsValid = false; break; }
              currentPrice += customOption.priceAdjustment || 0;
            }
          }
        }

        if (!optionsValid) {
          result.removedItems.push(`${oldItem.name} (Customizations changed)`);
          continue;
        }

        if (currentPrice !== oldItem.unitPrice) {
          result.priceChanges.push({
            name: oldItem.name,
            oldPrice: oldItem.unitPrice,
            newPrice: currentPrice
          });
        }

        result.validItems.push({
          menuItemId: currentItem._id,
          name: currentItem.name,
          imageUrl: currentItem.imageUrl || currentItem.image,
          quantity: oldItem.quantity,
          unitPrice: currentPrice,
          selectedOptions: oldItem.selectedOptions
        });
      }

      setValidationResult(result);
      
      const hasIssues = result.removedItems.length > 0 || 
                        result.unavailableItems.length > 0 || 
                        result.priceChanges.length > 0;

      if (hasIssues) {
        setShowModal(true);
      } else {
        // No issues, directly add to cart
        proceedWithReorder(result.validItems);
      }
    } catch (err) {
      toast.error('Failed to validate menu items for reorder');
    } finally {
      setIsChecking(false);
    }
  };

  const proceedWithReorder = (itemsToAdd) => {
    if (itemsToAdd.length === 0) {
      toast.error('No items available to reorder');
      setShowModal(false);
      return;
    }

    // Optional: Ask user if they want to clear current cart or append. 
    // We'll just append to be safe, but a toast will let them know.
    itemsToAdd.forEach(item => addItem(item));
    toast.success('Items added to cart!');
    setShowModal(false);
    navigate('/checkout');
  };

  return (
    <>
      <Button 
        onClick={handleReorderClick} 
        variant="outline" 
        className={`gap-2 ${className}`}
        isLoading={isChecking}
      >
        <RotateCcw size={16} />
        Reorder
      </Button>

      {showModal && validationResult && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface rounded-card border border-outline w-full max-w-md shadow-2xl p-6 space-y-6">
            
            <div className="flex justify-between items-start">
              <div className="flex gap-3 text-warning">
                <AlertTriangle size={24} className="shrink-0" />
                <div>
                  <h2 className="text-lg font-headline font-bold text-on-surface">Menu Updates</h2>
                  <p className="text-sm text-on-surface-variant mt-1">Some items from your past order have changed.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-on-surface">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              
              {validationResult.removedItems.length > 0 && (
                <div className="bg-error/10 border border-error/20 p-3 rounded-md text-sm text-error">
                  <p className="font-bold mb-1">No longer available:</p>
                  <ul className="list-disc pl-5">
                    {validationResult.removedItems.map((name, i) => <li key={i}>{name}</li>)}
                  </ul>
                </div>
              )}

              {validationResult.unavailableItems.length > 0 && (
                <div className="bg-warning/10 border border-warning/20 p-3 rounded-md text-sm text-warning">
                  <p className="font-bold mb-1">Sold out today:</p>
                  <ul className="list-disc pl-5">
                    {validationResult.unavailableItems.map((name, i) => <li key={i}>{name}</li>)}
                  </ul>
                </div>
              )}

              {validationResult.priceChanges.length > 0 && (
                <div className="bg-info/10 border border-info/20 p-3 rounded-md text-sm text-info">
                  <p className="font-bold mb-1">Price changes:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {validationResult.priceChanges.map((item, i) => (
                      <li key={i} className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="font-mono">${item.oldPrice.toFixed(2)} &rarr; ${item.newPrice.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-outline">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button 
                onClick={() => proceedWithReorder(validationResult.validItems)}
                disabled={validationResult.validItems.length === 0}
                className="gap-2"
              >
                <Check size={18} />
                Continue with {validationResult.validItems.length} items
              </Button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
