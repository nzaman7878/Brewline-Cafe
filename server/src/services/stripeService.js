import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2023-10-16',
});

export const getOrCreateCustomer = async (user) => {
  if (user.stripeCustomerId) {
    return { id: user.stripeCustomerId };
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    metadata: { userId: user._id.toString() },
  });

  return customer;
};

export const createPaymentIntent = async (amount, currency = 'usd', customerId, metadata = {}) => {
  return await stripe.paymentIntents.create({
    amount,
    currency,
    customer: customerId,
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });
};
