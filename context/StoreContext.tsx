
/**
 * Archivo: context/StoreContext.tsx
 * Propósito: Manejo de estado global (Reemplazo de Pinia para React)
 * Autor: Eliángel
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, CartItem, Product } from '../types';

interface StoreContextType {
  user: User | null;
  currency: 'USD' | 'BS';
  cart: CartItem[];
  favorites: number[];
  isCartOpen: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
  setCurrency: (c: 'USD' | 'BS') => void;
  addToCart: (product: Product, qty: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  toggleFavorite: (productId: number) => void;
  toggleCart: (open?: boolean) => void;
  cartTotalUsd: number;
  cartTotalBs: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currency, setCurrency] = useState<'USD' | 'BS'>('USD');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load from local storage on mount (Persistencia simple)
  useEffect(() => {
    const storedUser = localStorage.getItem('ctrl_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const storedCart = localStorage.getItem('ctrl_cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // Save cart on change
  useEffect(() => {
    localStorage.setItem('ctrl_cart', JSON.stringify(cart));
  }, [cart]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('ctrl_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ctrl_user');
    window.location.hash = '/login';
  };

  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('ctrl_user', JSON.stringify(updated));
    }
  };

  const addToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, qty: item.qty + qty } 
            : item
        );
      }
      return [...prev, { productId: product.id, qty, product }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  }

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  const toggleCart = (open?: boolean) => {
    setIsCartOpen(prev => open !== undefined ? open : !prev);
  }

  // Cálculo de totales aplicando descuentos si existen
  const cartTotalUsd = cart.reduce((acc, item) => {
    const discount = item.product.discount || 0;
    const price = item.product.priceUsd * (1 - discount / 100);
    return acc + (price * item.qty);
  }, 0);

  const cartTotalBs = cart.reduce((acc, item) => {
    const discount = item.product.discount || 0;
    const price = item.product.priceBs * (1 - discount / 100);
    return acc + (price * item.qty);
  }, 0);

  return (
    <StoreContext.Provider value={{
      user, currency, cart, favorites, isCartOpen,
      login, logout, updateUserProfile, setCurrency, addToCart, removeFromCart, clearCart, toggleFavorite, toggleCart,
      cartTotalUsd, cartTotalBs
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};
