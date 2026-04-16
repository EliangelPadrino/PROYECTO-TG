
/**
 * Archivo: types.ts
 * Propósito: Definiciones de tipos TypeScript
 */

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string; // Nuevo campo
  role: 'admin' | 'customer';
  token?: string; 
}

export interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  genres: string[];
  platforms: string[];
  modes: string[];
  type: 'game' | 'console' | 'accessory';
  priceUsd: number;
  priceBs: number;
  discount?: number; // Porcentaje de descuento (0-100)
  stock: number;
  images: string[];
  features: Record<string, string>;
  status: 'active' | 'inactive';
  salesCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: number;
  qty: number;
  product: Product;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  totalUsd: number;
  totalBs: number;
  status: 'pending' | 'paid' | 'confirmed' | 'delivered' | 'cancelled' | 'rejected';
  paymentMethod?: string;
  paymentRef?: string;
  paymentScreenshot?: string;
  createdAt: string;
}

export interface Notification {
  id: number;
  type: 'low_stock' | 'new_order' | 'new_faq';
  message: string;
  read: boolean;
  timestamp: string;
}

export interface CarouselConfig {
  id: number;
  title: string;
  subtitle: string;
  productIds: number[];
}

export interface ExchangeConfig {
  baseRate: number;
  percentage: number;
  finalRate: number;
  lastUpdated: string;
}
