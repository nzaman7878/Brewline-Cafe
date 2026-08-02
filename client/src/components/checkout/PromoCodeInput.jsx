import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const PromoCodeInput = ({ subtotal, onApply }) => {
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsApplying(true);
    try {
      const res = await api.post('/promo/validate', { code: code.trim(), subtotal });
      const promoData = res.data.data;
      setAppliedPromo(promoData);
      onApply(promoData);
      toast.success('Promo code applied!');
      setCode(''); // clear input
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid promo code');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemove = () => {
    setAppliedPromo(null);
    onApply(null);
  };

  return (
    <div className="bg-surface rounded-card border border-outline p-6 space-y-4">
      <h3 className="font-headline font-bold text-lg text-on-surface">Promo Code</h3>
      
      {appliedPromo ? (
        <div className="flex justify-between items-center p-3 bg-primary/10 border border-primary/20 rounded-md">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary tracking-wide uppercase">{appliedPromo.code}</span>
            <span className="text-sm text-on-surface-variant">
              ({appliedPromo.discountType === 'percentage' ? `${appliedPromo.discountValue}% off` : `$${appliedPromo.discountValue} off`})
            </span>
          </div>
          <button 
            onClick={handleRemove}
            className="text-xs font-bold text-error hover:underline"
            type="button"
          >
            Remove
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex gap-2">
          <Input 
            placeholder="Enter code" 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            className="flex-1"
            disabled={isApplying}
          />
          <Button type="submit" disabled={!code.trim() || isApplying} isLoading={isApplying}>
            Apply
          </Button>
        </form>
      )}
    </div>
  );
};
