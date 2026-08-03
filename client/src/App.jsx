import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
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
import { OrderHistory } from './pages/OrderHistory';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AvailabilityPanel } from './pages/staff/AvailabilityPanel';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOverview } from './pages/admin/AdminOverview';
import { MenuManager } from './pages/admin/MenuManager';
import { PromoManager } from './pages/admin/PromoManager';
import { OrderManager } from './pages/admin/OrderManager';
import { Analytics } from './pages/admin/Analytics';
import { AdminUsers } from './pages/admin/AdminUsers';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <HelmetProvider>
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
                
                {/* Auth-Protected Customer Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="profile" element={<Profile />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="orders" element={<OrderHistory />} />
                </Route>

                {/* Public Menu & Cart */}
                <Route path="menu" element={<Menu />} />
                <Route path="cart" element={<Cart />} />
                <Route path="order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="track" element={<OrderTracking />} />
                <Route path="track/:id" element={<OrderTracking />} />
                
                {/* Staff Routes (staff or admin role) */}
                <Route element={<ProtectedRoute allowedRoles={['staff', 'admin']} />}>
                  <Route path="staff/dashboard" element={<StaffDashboard />} />
                  <Route path="staff/86" element={<AvailabilityPanel />} />
                </Route>
                
                {/* Admin Routes */}
                <Route path="admin" element={<AdminDashboard />}>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<AdminOverview />} />
                  <Route path="menu" element={<MenuManager />} />
                  <Route path="promos" element={<PromoManager />} />
                  <Route path="orders" element={<OrderManager />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="users" element={<AdminUsers />} />
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </SocketProvider>
    </AuthProvider>
  </HelmetProvider>
  );
}

export default App;
