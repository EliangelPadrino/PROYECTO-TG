
/**
 * Archivo: App.tsx
 * Propósito: Componente raíz, configuración de rutas y proveedores globales.
 * Autor: Eliángel
 */
import React from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar, Footer, CartSidebar } from './components/Layout';
import { ChatWidget } from './components/Widgets';
import { Home, Catalog, ProductDetails, CartPage, About, FAQ, FavoritesPage } from './pages/PublicPages';
import { UserProfile } from './pages/UserProfile';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login, Register } from './pages/AuthPages';

// Layout wrapper for public pages
const MainLayout = () => (
  <>
    <Navbar />
    <CartSidebar />
    <Outlet />
    <ChatWidget />
    <Footer />
  </>
);

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected/Admin Routes */}
          <Route path="/admin" element={
            <>
              <Navbar />
              <AdminDashboard />
            </>
          } />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
};

export default App;
