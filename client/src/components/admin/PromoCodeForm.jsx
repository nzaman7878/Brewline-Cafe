import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const PromoCodeForm = ({ promo, onClose, onSuccess }) => {
  const isEdit = !!promo;
  
  // Strip out the time from ISO string for the date input
  const defaultDate = promo?.expiryDate 
    ? new Date(promo.expiryDate).toISOString().split('T')[0] 
    : '';

  const [code, setCode] = useState(promo?.code || '');
  const [discountType, setDiscountType] = useState(promo?.discountType || 'percentage');
  const [discountValue, setDiscountValue] = useState(promo?.discountValue || '');
  const [minOrderValue, setMinOrderValue] = useState(promo?.minOrderValue || 0);
  const [maxUses, setMaxUses] = useState(promo?.maxUses || '');
  const [expiryDate, setExpiryDate] = useState(defaultDate);
  const [isActive, setIsActive] = useState(promo?.isActive ?? true);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue),
      maxUses: maxUses ? Number(maxUses) : null,
      expiryDate,
      isActive
    };

    try {
      if (isEdit) {
        await api.put(`/admin/promo-codes/${promo._id}`, payload);
        toast.success('Promo code updated');
      } else {
        await api.post('/admin/promo-codes', payload);
        toast.success('Promo code created');
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save promo code');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-card border border-outline w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-6 border-b border-outline bg-surface rounded-t-card">
          <h2 className="text-2xl font-headline font-bold text-on-surface">
            {isEdit ? 'Edit Promo Code' : 'Create Promo Code'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-surface-variant rounded-full text-on-surface-variant">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          <div className="space-y-4">
            <Input 
              label="Promo Code" 
              placeholder="e.g. SUMMER25" 
              value={code} 
              onChange={e => setCode(e.target.value)} 
              className="uppercase font-mono font-bold tracking-wider"
              required 
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface">Discount Type</label>
                <select 
                  className="w-full bg-surface-variant text-on-surface border border-outline rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary h-[46px]"
                  value={discountType}
                  onChange={e => setDiscountType(e.target.value)}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div className="relative">
                <Input 
                  label="Discount Value" 
                  type="number" 
                  step={discountType === 'percentage' ? '1' : '0.01'}
                  max={discountType === 'percentage' ? '100' : undefined}
                  value={discountValue} 
                  onChange={e => setDiscountValue(e.target.value)} 
                  required 
                  className={discountType === 'fixed' ? 'pl-7' : 'pr-7'}
                />
                {discountType === 'fixed' && <span className="absolute left-3 top-[34px] text-on-surface-variant">$</span>}
                {discountType === 'percentage' && <span className="absolute right-3 top-[34px] text-on-surface-variant">%</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <Input 
                  label="Min Order Amount" 
                  type="number" 
                  step="0.01" 
                  value={minOrderValue} 
                  onChange={e => setMinOrderValue(e.target.value)} 
                  className="pl-7"
                />
                <span className="absolute left-3 top-[34px] text-on-surface-variant">$</span>
              </div>
              
              <Input 
                label="Max Uses (Optional)" 
                type="number" 
                placeholder="Leave blank for unlimited"
                value={maxUses} 
                onChange={e => setMaxUses(e.target.value)} 
              />
            </div>

            <Input 
              label="Expiry Date" 
              type="date" 
              value={expiryDate} 
              onChange={e => setExpiryDate(e.target.value)} 
              required 
            />

            <label className="flex items-center gap-3 pt-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={isActive} 
                onChange={e => setIsActive(e.target.checked)} 
                className="w-5 h-5 rounded border-outline text-primary focus:ring-primary"
              />
              <span className="font-bold text-on-surface">Promo Code is Active</span>
            </label>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-outline">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" isLoading={isSubmitting} className="gap-2">
              <Save size={18} /> Save Promo
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
};
