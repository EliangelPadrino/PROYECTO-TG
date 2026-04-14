
/**
 * Archivo: components/Layout.tsx
 * Propósito: Estructura base de la UI (Navbar, Sidebar, Footer)
 * Autor: Eliángel
 */
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, User as UserIcon, Search, Menu, X, LogOut, Shield } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { user, currency, setCurrency, cart, toggleCart, logout } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-bold tracking-tighter text-gray-900">
              CTRL<span className="text-[#6A00FF]">-FREAK</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-gray-600 hover:text-[#6A00FF] transition-colors font-medium text-sm">Inicio</Link>
            <Link to="/catalog" className="text-gray-600 hover:text-[#6A00FF] transition-colors font-medium text-sm">Catálogo</Link>
            <Link to="/about" className="text-gray-600 hover:text-[#6A00FF] transition-colors font-medium text-sm">Sobre nosotros</Link>
            <Link to="/faq" className="text-gray-600 hover:text-[#6A00FF] transition-colors font-medium text-sm">Preguntas Frecuentes</Link>
          </div>

          {/* Icons & Actions */}
          <div className="hidden md:flex items-center space-x-5">
            {/* Currency Toggle */}
            <button 
              onClick={() => setCurrency(currency === 'USD' ? 'BS' : 'USD')}
              className="text-xs font-bold border border-gray-200 rounded px-2 py-1 hover:border-[#6A00FF] transition text-gray-900"
            >
              {currency}
            </button>

            {/* Search */}
            <div className="relative group">
              <Search className="w-5 h-5 text-gray-400 group-hover:text-[#6A00FF] transition-colors cursor-pointer" />
            </div>

            <Link to="/favorites">
              <Heart className="w-5 h-5 text-gray-400 hover:text-[#6A00FF] transition-colors cursor-pointer" />
            </Link>

            <div className="relative cursor-pointer" onClick={() => toggleCart(true)}>
              <ShoppingCart className="w-5 h-5 text-gray-400 hover:text-[#6A00FF] transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#6A00FF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>

            {/* User Dropdown / Auth */}
            {user ? (
              <div className="flex items-center gap-2">
                 <Link to={user.role === 'admin' ? "/admin" : "/profile"}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6A00FF] to-purple-400 flex items-center justify-center text-white font-bold text-xs">
                      {user.firstName[0]}
                    </div>
                 </Link>
                 <button onClick={logout} title="Salir">
                   <LogOut className="w-4 h-4 text-gray-400 hover:text-red-500" />
                 </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-semibold text-[#6A00FF] hover:underline">
                Ingresar
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-[#6A00FF] p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#6A00FF]">Inicio</Link>
              <Link to="/catalog" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#6A00FF]">Catálogo</Link>
              <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#6A00FF]">Sobre nosotros</Link>
              <Link to="/faq" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#6A00FF]">Preguntas Frecuentes</Link>
              <Link to="/login" className="block px-3 py-2 text-base font-medium text-[#6A00FF]">Ingresar / Registro</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-gray-50 border-t border-gray-100 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">CTRL-FREAK</h3>
        <p className="text-sm text-gray-500">Tu destino definitivo para gaming, hardware y coleccionables. Entregas en toda la galaxia.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Explorar</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><Link to="/catalog" className="hover:text-[#6A00FF]">Juegos</Link></li>
          <li><Link to="/catalog" className="hover:text-[#6A00FF]">Consolas</Link></li>
          <li><Link to="/catalog" className="hover:text-[#6A00FF]">Accesorios</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Ayuda</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li><Link to="/about#contact" className="hover:text-[#6A00FF]">Contacto</Link></li>
          <li><Link to="/faq" className="hover:text-[#6A00FF]">Preguntas Frecuentes</Link></li>
          <li><Link to="/terms" className="hover:text-[#6A00FF]">Términos</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Síguenos</h4>
        <div className="flex space-x-4">
          {/* Social Icons Placeholder */}
          <div className="w-8 h-8 bg-gray-200 rounded-full hover:bg-[#6A00FF] transition-colors"></div>
          <div className="w-8 h-8 bg-gray-200 rounded-full hover:bg-[#6A00FF] transition-colors"></div>
        </div>
      </div>
    </div>
  </footer>
);

export const CartSidebar: React.FC = () => {
  const { cart, isCartOpen, toggleCart, currency, cartTotalUsd, cartTotalBs, removeFromCart } = useStore();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleCart(false)}
            className="fixed inset-0 bg-black z-50"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-y-0 right-0 max-w-md w-full bg-white z-[60] shadow-xl flex flex-col"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold">Tu Carrito</h2>
              <button onClick={() => toggleCart(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">Tu carrito está vacío.</div>
              ) : (
                cart.map(item => {
                  const hasDiscount = (item.product.discount || 0) > 0;
                  const originalPrice = currency === 'USD' ? item.product.priceUsd : item.product.priceBs;
                  const finalPrice = hasDiscount ? originalPrice * (1 - item.product.discount! / 100) : originalPrice;

                  return (
                    <div key={item.productId} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg relative overflow-hidden">
                      {hasDiscount && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">-{item.product.discount}%</div>}
                      <img src={item.product.images[0]} alt={item.product.title} className="w-16 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold line-clamp-2 pr-6">{item.product.title}</h4>
                        <div className="text-xs text-gray-500 mt-1">Cant: {item.qty}</div>
                        <div className="flex flex-col mt-1">
                           {hasDiscount && (
                             <span className="text-[10px] text-gray-400 line-through font-bold">
                               {currency === 'USD' ? `$${originalPrice.toFixed(2)}` : `Bs ${originalPrice.toFixed(2)}`}
                             </span>
                           )}
                           <span className={`text-sm font-bold ${hasDiscount ? 'text-red-500' : 'text-[#6A00FF]'}`}>
                             {currency === 'USD' ? `$${finalPrice.toFixed(2)}` : `Bs ${finalPrice.toFixed(2)}`}
                           </span>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600 mt-auto">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold text-[#6A00FF]">
                   {currency === 'USD' ? `$${cartTotalUsd.toFixed(2)}` : `Bs ${cartTotalBs.toFixed(2)}`}
                </span>
              </div>
              <button 
                onClick={() => { toggleCart(false); navigate('/cart'); }}
                className="w-full bg-[#6A00FF] text-white py-3 rounded-lg font-semibold hover:bg-[#5b00db] transition-colors"
              >
                Ver Carrito Completo
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
