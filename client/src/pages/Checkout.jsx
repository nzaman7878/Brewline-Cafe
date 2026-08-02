import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

import api from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import { useCart } from '../../hooks/useCart';

import { OrderSummary } from '../components/checkout/OrderSummary';
import { PickupTimeSelector } from '../components/checkout/PickupTimeSelector';
import { PromoCodeInput } from '../components/checkout/PromoCodeInput';
import { GuestInfoForm } from '../components/checkout/GuestInfoForm';
import { PaymentForm } from '../components/checkout/PaymentForm';
import { Button } from '../components/ui/Button';

// Make sure to call `loadStripe` outside of a component’s render to avoid recreating the `Stripe` object on every render.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

export const Checkout = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const { items, cartSubtotal, clearCart } = useCart();
  const navigate = useNavigate();

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  // Step 1 State
  const [pickupTime, setPickupTime] = useState('');
  const [promoCode, setPromoCode] = useState(null); // stores the applied promo object
  const [guestInfo, setGuestInfo] = useState({ guestName: '', guestEmail: '', guestPhone: '' });
  
  // Step 2 State
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const discountAmount = promoCode ? promoCode.discountAmount : 0;
  const taxRate = 0.08875;
  const subtotal = cartSubtotal;
  const afterDiscount = Math.max(0, subtotal - discountAmount);
  const taxAmount = afterDiscount * taxRate;
  const total = afterDiscount + taxAmount;

  const handleContinueToPayment = async (e) => {
    e.preventDefault();
    if (!pickupTime) {
      return toast.error('Please select a pickup time');
    }
    
    if (!isAuthenticated && (!guestInfo.guestName || !guestInfo.guestEmail || !guestInfo.guestPhone)) {
      return toast.error('Please fill out all guest details');
    }

    setIsCreatingOrder(true);
    try {
      const payload = {
        items: items.map(i => ({ 
          menuItemId: i.menuItemId, 
          quantity: i.quantity, 
          selectedOptions: i.selectedOptions 
        })),
        pickupTime,
        promoCode: promoCode?.code,
        ...(!isAuthenticated && guestInfo),
        idempotencyKey: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      const { data } = await api.post('/orders', payload);
      setClientSecret(data.data.clientSecret);
      setOrderId(data.data._id);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    // Phase 24: In a real app, Webhooks handle the definitive status update.
    // For now, we'll just clear cart and redirect.
    clearCart();
    navigate(`/order-confirmation/${orderId}`);
  };

  // Prevent rendering if empty (useEffect will redirect, but we need to return null here to avoid errors)
  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background container mx-auto px-4 py-8 lg:py-12 max-w-6xl">
      <div className="mb-8 flex items-center">
        {clientSecret && (
          <button 
            onClick={() => setClientSecret('')} 
            className="mr-4 p-2 bg-surface rounded-full text-on-surface-variant hover:text-primary transition-colors"
            title="Back to Details"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <h1 className="text-4xl font-headline font-extrabold text-on-surface">Secure Checkout</h1>
      </div>

      <div className="flex flex-col-reverse lg:flex-row gap-8 lg:gap-12">
        {/* Left Column: Flow */}
        <div className="flex-1 space-y-8">
          
          {!clientSecret ? (
            <form id="checkout-details-form" onSubmit={handleContinueToPayment} className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
              {/* Step 1: Details */}
              {!isAuthenticated && (
                <GuestInfoForm values={guestInfo} onChange={setGuestInfo} />
              )}
              
              <div className="bg-surface rounded-card border border-outline p-6">
                <h3 className="font-headline font-bold text-lg text-on-surface mb-4">When would you like it?</h3>
                <PickupTimeSelector value={pickupTime} onChange={setPickupTime} />
              </div>

              <PromoCodeInput subtotal={cartSubtotal} onApply={setPromoCode} />

              <div className="hidden lg:block">
                <Button 
                  type="submit" 
                  className="w-full py-4 text-lg shadow-xl group" 
                  isLoading={isCreatingOrder}
                >
                  Continue to Payment
                  <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          ) : (
            /* Step 2: Payment */
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
              <PaymentForm onPaymentSuccess={handlePaymentSuccess} total={total} />
            </Elements>
          )}

        </div>

        {/* Right Column: Summary */}
        <div className="lg:w-96">
          <OrderSummary discountAmount={discountAmount} taxRate={taxRate} />
          
          {/* Mobile continue button to keep it visible below summary if in step 1 */}
          {!clientSecret && (
            <div className="lg:hidden mt-6">
              <Button 
                type="submit" 
                form="checkout-details-form"
                className="w-full py-4 text-lg shadow-xl group" 
                isLoading={isCreatingOrder}
              >
                Continue to Payment
                <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
