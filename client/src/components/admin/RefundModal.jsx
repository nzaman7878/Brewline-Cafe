import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const RefundModal = ({ order, onClose, onSuccess }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRefund = async () => {
    setIsSubmitting(true);
    try {
      // Backend does not currently store the reason, but we collect it for UI completeness
      await api.post(`/admin/orders/${order._id}/refund`, { reason });
      toast.success('Refund processed successfully');
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process refund');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface rounded-card border border-outline w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 p-6 space-y-6">
        
        <div className="flex justify-between items-start">
          <div className="flex gap-3 text-error">
            <AlertTriangle size={24} className="shrink-0" />
            <div>
              <h2 className="text-lg font-headline font-bold">Process Refund</h2>
              <p className="text-sm text-on-surface-variant mt-1">This action cannot be undone.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <X size={20} />
          </button>
        </div>

        <div className="bg-surface-variant/50 p-4 rounded-md space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Order ID:</span>
            <span className="font-mono">{order._id.slice(-6).toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant">Customer:</span>
            <span>{order.guestName || order.customer?.firstName || 'Guest'}</span>
          </div>
          <div className="flex justify-between font-bold border-t border-outline pt-2 mt-2">
            <span>Refund Amount:</span>
            <span className="text-error">${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">Reason for Refund (Optional)</label>
          <textarea 
            className="w-full bg-surface-variant border border-outline rounded-md p-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="e.g. Customer changed mind, item out of stock..."
            rows={3}
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-error text-on-error hover:bg-error/90" 
            onClick={handleRefund} 
            isLoading={isSubmitting}
          >
            Confirm Refund
          </Button>
        </div>

      </div>
    </div>
  );
};
