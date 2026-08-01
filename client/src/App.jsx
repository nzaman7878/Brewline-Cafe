import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout/Layout';
import { Home } from './pages/Home';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* Future Routes */}
            {/* <Route path="menu" element={<Menu />} /> */}
            {/* <Route path="login" element={<Login />} /> */}
            {/* <Route path="track" element={<TrackOrder />} /> */}
            <Route path="*" element={<div className="p-8 text-center">404 - Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
