import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Menu } from './pages/Menu';

function App() {
  return (
    <AuthProvider>
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
            
            {/* Menu */}
            <Route path="menu" element={<Menu />} />
            
            {/* Future Routes */}
            {/* <Route path="track" element={<TrackOrder />} /> */}
            <Route path="*" element={<div className="p-8 text-center">404 - Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
