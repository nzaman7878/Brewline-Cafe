import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Menu } from './pages/Menu';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { OrderTracking } from './pages/OrderTracking';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AvailabilityPanel } from './pages/staff/AvailabilityPanel';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MenuManager } from './pages/admin/MenuManager';
import { PromoManager } from './pages/admin/PromoManager';
import { OrderManager } from './pages/admin/OrderManager';
import { Analytics } from './pages/admin/Analytics';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <CartProvider>
          <BrowserRouter>
            <Toaster 
              position="bottom-center"
              toastOptions={{
                style: {
                  background: '#231917',
                  color: '#EDE0DB',
                  border: '1px solid #3D2E2A'
                },
                success: { iconTheme: { primary: '#4CAF50', secondary: '#231917' } },
                error: { iconTheme: { primary: '#CF6679', secondary: '#231917' } },
              }}
            />
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="profile" element={<Profile />} />
                </Route>
                
                {/* Menu & Cart & Checkout */}
                <Route path="menu" element={<Menu />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
                
                {/* Future Routes */}
                <Route path="track" element={<OrderTracking />} />
                <Route path="track/:id" element={<OrderTracking />} />
                
                {/* Staff Routes */}
                <Route path="staff/dashboard" element={<StaffDashboard />} />
                <Route path="staff/86" element={<AvailabilityPanel />} />
                
                {/* Admin Routes */}
                <Route path="admin" element={<AdminDashboard />}>
                  {/* Default to menu manager for now, overview will be built next */}
                  <Route path="menu" element={<MenuManager />} />
                  <Route path="promos" element={<PromoManager />} />
                  <Route path="orders" element={<OrderManager />} />
                  <Route path="analytics" element={<Analytics />} />
                </Route>
                
                <Route path="*" element={<div className="p-8 text-center">404 - Not Found</div>} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
