export const getOrderConfirmationTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #231917; color: #EDE0DB; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #3D2E2A; padding: 30px; border-radius: 8px; border-top: 4px solid #D4A373; }
    h1 { color: #D4A373; font-size: 24px; margin-bottom: 10px; }
    .order-id { font-family: monospace; color: #968E8B; }
    .items { margin: 20px 0; border-collapse: collapse; w-full; }
    .item { padding: 10px 0; border-bottom: 1px solid #4a3b37; display: flex; justify-content: space-between; }
    .total { margin-top: 20px; font-size: 20px; font-weight: bold; text-align: right; color: #D4A373; }
    .footer { margin-top: 30px; font-size: 12px; color: #968E8B; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>We've got your order! ☕</h1>
    <p>Hi ${order.guestName || order.customer?.firstName || 'Coffee Lover'},</p>
    <p>Your order <span class="order-id">#${order._id.toString().slice(-6).toUpperCase()}</span> has been received and is being prepared.</p>
    
    <div class="items">
      ${order.items.map(item => `
        <div class="item">
          <span>${item.quantity}x ${item.name}</span>
          <span>$${(item.unitPrice * item.quantity).toFixed(2)}</span>
        </div>
      `).join('')}
    </div>
    
    <div class="total">
      Total: $${order.total.toFixed(2)}
    </div>
    
    <p>We'll notify you as soon as it's ready for pickup!</p>
    
    <div class="footer">
      Brewline Cafe &bull; 123 Coffee St.
    </div>
  </div>
</body>
</html>
`;

export const getOrderReadyTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #231917; color: #EDE0DB; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #3D2E2A; padding: 30px; border-radius: 8px; border-top: 4px solid #4CAF50; }
    h1 { color: #4CAF50; font-size: 24px; margin-bottom: 10px; }
    .order-id { font-family: monospace; color: #968E8B; }
    .footer { margin-top: 30px; font-size: 12px; color: #968E8B; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Your order is ready! 🎉</h1>
    <p>Hi ${order.guestName || order.customer?.firstName || 'Coffee Lover'},</p>
    <p>Your order <span class="order-id">#${order._id.toString().slice(-6).toUpperCase()}</span> is fresh and ready for pickup at the counter.</p>
    
    <p>See you soon!</p>
    
    <div class="footer">
      Brewline Cafe &bull; 123 Coffee St.
    </div>
  </div>
</body>
</html>
`;

export const getRefundTemplate = (order) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #231917; color: #EDE0DB; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #3D2E2A; padding: 30px; border-radius: 8px; border-top: 4px solid #F44336; }
    h1 { color: #F44336; font-size: 24px; margin-bottom: 10px; }
    .order-id { font-family: monospace; color: #968E8B; }
    .footer { margin-top: 30px; font-size: 12px; color: #968E8B; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Order Refunded</h1>
    <p>Hi ${order.guestName || order.customer?.firstName || 'Coffee Lover'},</p>
    <p>Your order <span class="order-id">#${order._id.toString().slice(-6).toUpperCase()}</span> has been refunded.</p>
    
    <p>A refund of $${order.total.toFixed(2)} has been issued back to your original payment method. It may take 3-5 business days to appear on your statement.</p>
    
    <p>We apologize for any inconvenience.</p>
    
    <div class="footer">
      Brewline Cafe &bull; 123 Coffee St.
    </div>
  </div>
</body>
</html>
`;

export const getWelcomeTemplate = (user) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #231917; color: #EDE0DB; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background-color: #3D2E2A; padding: 30px; border-radius: 8px; border-top: 4px solid #D4A373; }
    h1 { color: #D4A373; font-size: 24px; margin-bottom: 10px; }
    .footer { margin-top: 30px; font-size: 12px; color: #968E8B; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Welcome to Brewline Cafe! ☕</h1>
    <p>Hi ${user.firstName},</p>
    <p>Thanks for creating an account! You can now easily order ahead, track your favorites, and manage your preferences.</p>
    
    <p>We're thrilled to have you.</p>
    
    <div class="footer">
      Brewline Cafe &bull; 123 Coffee St.
    </div>
  </div>
</body>
</html>
`;
