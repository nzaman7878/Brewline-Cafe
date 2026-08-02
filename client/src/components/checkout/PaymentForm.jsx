import { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from '../ui/Button';
import toast from 'react-hot-toast';

export const PaymentForm = ({ onPaymentSuccess, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    
    setIsProcessing(true);
    
    // We use redirect: 'if_required' so we can handle the success state within our SPA 
    // rather than doing a full page refresh.
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });
    
    if (error) {
      // Show error to your customer (e.g., payment details incomplete)
      toast.error(error.message);
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess(paymentIntent);
    } else {
      // e.g. requires_action
      toast.error('Payment requires additional action.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface rounded-card border border-outline p-6 space-y-6 animate-in fade-in duration-500">
      <h3 className="font-headline font-bold text-lg text-on-surface">Payment Details</h3>
      
      <div className="p-4 bg-surface-variant rounded-md mb-4">
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        isLoading={isProcessing}
        className="w-full py-4 text-lg mt-4 shadow-xl"
      >
        Pay ${(total || 0).toFixed(2)}
      </Button>
    </form>
  );
};
