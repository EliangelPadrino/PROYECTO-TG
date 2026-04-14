
/**
 * Archivo: services/mockService.ts
 * Propósito: Simular backend mutable para la demo
 */

import { Product, User, Order, Notification, CarouselConfig, ExchangeConfig } from '../types';

const INCOMING_IMG = "https://placehold.co/600x800/111827/6A00FF?text=Incoming...&font=roboto";

// Configuración inicial de la tasa
let MOCK_EXCHANGE: ExchangeConfig = {
  baseRate: 35,
  percentage: 0,
  finalRate: 35,
  lastUpdated: new Date().toISOString()
};

// Cambiamos a 'let' para permitir mutaciones durante la sesión
let MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    title: "Cyberpunk 2077: Ultimate Edition",
    slug: "cyberpunk-2077",
    description: "Una historia de acción y aventura en mundo abierto ambientada en Night City.",
    genres: ["RPG", "Acción"],
    platforms: ["PS5", "Xbox", "PC"],
    modes: ["Individual"],
    type: "game",
    priceUsd: 59.99,
    priceBs: 2100, // Será recalculado al iniciar si se llama updateExchangeConfig
    stock: 25,
    images: [INCOMING_IMG],
    features: { developer: "CD Projekt Red", year: "2020" },
    status: 'active',
    salesCount: 150,
    createdAt: "2020-12-10T00:00:00Z"
  },
  {
    id: 2,
    title: "Elden Ring",
    slug: "elden-ring",
    description: "El nuevo juego de rol y acción de fantasía de FromSoftware.",
    genres: ["RPG", "Acción"],
    platforms: ["PS5", "PS4", "Xbox"],
    modes: ["Individual", "Multijugador", "Online"],
    type: "game",
    priceUsd: 49.99,
    priceBs: 1750,
    stock: 4,
    discount: 15,
    images: [INCOMING_IMG],
    features: { developer: "FromSoftware", year: "2022" },
    status: 'active',
    salesCount: 300,
    createdAt: "2022-02-25T00:00:00Z"
  },
  {
    id: 3,
    title: "PlayStation 5 Console",
    slug: "ps5-console",
    description: "Experimenta cargas superrápidas gracias a una unidad de estado sólido (SSD) de alta velocidad.",
    genres: ["Hardware"],
    platforms: ["PlayStation"],
    modes: [],
    type: "console",
    priceUsd: 499.99,
    priceBs: 17500,
    stock: 10,
    images: ["https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&w=800&q=80"],
    features: { storage: "825GB", color: "White" },
    status: 'active',
    salesCount: 50,
    createdAt: "2020-11-12T00:00:00Z"
  }
];

let MOCK_USERS: User[] = [
  { id: 1, firstName: "Admin", lastName: "User", username: "admin", phone: "0414-1234567", email: "admin@ctrlfreak.com", role: "admin", token: "jwt-admin-secret" },
  { id: 2, firstName: "Client", lastName: "User", username: "client", phone: "0412-7654321", email: "client@gmail.com", role: "customer", token: "jwt-client-secret" }
];

let MOCK_ORDERS: Order[] = [];

// Configuración de los carruseles de la página de inicio
let MOCK_CAROUSELS: CarouselConfig[] = [
  { id: 1, title: "Lo más jugado", subtitle: "Los favoritos de la comunidad esta semana.", productIds: [1, 2] },
  { id: 2, title: "Grandes Ofertas", subtitle: "Ahorra hasta un 90% en títulos seleccionados.", productIds: [2] },
  { id: 3, title: "Recién Llegados", subtitle: "Explora lo último en hardware y software.", productIds: [3, 1] }
];

export const mockService = {
  login: async (email: string, pass: string): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    const user = MOCK_USERS.find(u => u.email === email);
    if (user) return user;
    throw new Error("Credenciales inválidas");
  },

  register: async (userData: Omit<User, 'id' | 'role' | 'token'>): Promise<User> => {
    await new Promise(r => setTimeout(r, 800));
    const exists = MOCK_USERS.find(u => u.email === userData.email || u.username === userData.username);
    if (exists) throw new Error("El usuario o correo ya existe.");

    const newUser: User = {
      id: MOCK_USERS.length + 1,
      ...userData,
      role: 'customer',
      token: `jwt-new-${Date.now()}`
    };
    MOCK_USERS.push(newUser);
    return newUser;
  },

  getUsers: async (): Promise<User[]> => {
    await new Promise(r => setTimeout(r, 400));
    return [...MOCK_USERS];
  },

  updateUser: async (id: number, data: Partial<User>): Promise<User> => {
    await new Promise(r => setTimeout(r, 600));
    const index = MOCK_USERS.findIndex(u => u.id === id);
    if (index === -1) throw new Error("Usuario no encontrado");

    MOCK_USERS[index] = { ...MOCK_USERS[index], ...data };
    return MOCK_USERS[index];
  },

  getProducts: async (filters?: any): Promise<Product[]> => {
    await new Promise(r => setTimeout(r, 200));
    let data = [...MOCK_PRODUCTS];

    if (filters?.type && filters.type !== 'all') data = data.filter(p => p.type === filters.type);
    if (filters?.genre) data = data.filter(p => p.genres.includes(filters.genre));
    if (filters?.platform) data = data.filter(p => p.platforms.some(plat => plat.includes(filters.platform)));
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      data = data.filter(p => p.title.toLowerCase().includes(q));
    }
    if (filters?.priceMax) data = data.filter(p => p.priceUsd <= filters.priceMax);
    
    return data;
  },

  getProductById: async (id: number): Promise<Product | undefined> => {
    return MOCK_PRODUCTS.find(p => p.id === id);
  },

  addProduct: async (productData: Partial<Product>): Promise<Product> => {
    await new Promise(r => setTimeout(r, 1000));
    const newProduct: Product = {
      id: MOCK_PRODUCTS.length + 1,
      title: productData.title || "Nuevo Producto",
      slug: (productData.title || "").toLowerCase().replace(/ /g, '-'),
      description: productData.description || "",
      genres: productData.genres || [],
      platforms: productData.platforms || [],
      modes: productData.modes || [],
      type: productData.type || 'game',
      priceUsd: productData.priceUsd || 0,
      priceBs: (productData.priceUsd || 0) * MOCK_EXCHANGE.finalRate, // Usa tasa actual
      discount: productData.discount || 0,
      stock: productData.stock || 0,
      images: productData.images || [INCOMING_IMG],
      features: productData.features || {},
      status: 'active',
      salesCount: 0,
      createdAt: new Date().toISOString()
    };
    MOCK_PRODUCTS.unshift(newProduct);
    return newProduct;
  },

  updateProduct: async (id: number, data: Partial<Product>): Promise<Product> => {
    await new Promise(r => setTimeout(r, 500));
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx === -1) throw new Error("Producto no encontrado");
    
    MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...data };
    // Recalcular precio en BS si cambió el USD, usando la tasa actual global
    if (data.priceUsd) MOCK_PRODUCTS[idx].priceBs = data.priceUsd * MOCK_EXCHANGE.finalRate;
    
    return MOCK_PRODUCTS[idx];
  },

  deleteProduct: async (id: number) => {
    MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
    return true;
  },

  createOrder: async (order: Partial<Order>): Promise<Order> => {
    const newOrder: Order = {
      id: Math.floor(Math.random() * 9000) + 1000,
      userId: order.userId!,
      items: order.items!,
      totalUsd: order.totalUsd!,
      totalBs: order.totalBs!,
      status: 'pending',
      paymentMethod: order.paymentMethod,
      paymentRef: order.paymentRef,
      paymentScreenshot: order.paymentScreenshot,
      createdAt: new Date().toISOString()
    };
    MOCK_ORDERS.unshift(newOrder);
    return newOrder;
  },

  getOrders: async (): Promise<Order[]> => [...MOCK_ORDERS],

  updateOrderStatus: async (id: number, status: Order['status']): Promise<Order> => {
    const orderIdx = MOCK_ORDERS.findIndex(o => o.id === id);
    if (orderIdx === -1) throw new Error("Pedido no encontrado");

    // Lógica de descuento de inventario si se marca como pagado
    if (status === 'paid' && MOCK_ORDERS[orderIdx].status !== 'paid') {
      const order = MOCK_ORDERS[orderIdx];
      
      // Iterar sobre los items y descontar stock
      for (const item of order.items) {
        const productIndex = MOCK_PRODUCTS.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          // Descontar stock asegurando que no baje de 0
          MOCK_PRODUCTS[productIndex].stock = Math.max(0, MOCK_PRODUCTS[productIndex].stock - item.qty);
          MOCK_PRODUCTS[productIndex].salesCount += item.qty;
        }
      }
    }

    MOCK_ORDERS[orderIdx] = { ...MOCK_ORDERS[orderIdx], status };
    return MOCK_ORDERS[orderIdx];
  },

  getMetrics: async () => ({
    totalProducts: MOCK_PRODUCTS.length,
    totalUsers: MOCK_USERS.length,
    monthlySales: 4500.50,
    lowStock: MOCK_PRODUCTS.filter(p => p.stock <= 5).length
  }),

  getNotifications: async (): Promise<Notification[]> => [
    { id: 1, type: 'low_stock', message: 'Revisa el stock de productos', read: false, timestamp: new Date().toISOString() }
  ],

  getCarousels: async (): Promise<CarouselConfig[]> => [...MOCK_CAROUSELS],

  updateCarousel: async (id: number, data: Partial<CarouselConfig>): Promise<CarouselConfig> => {
    const idx = MOCK_CAROUSELS.findIndex(c => c.id === id);
    if (idx === -1) throw new Error("Carrusel no encontrado");
    MOCK_CAROUSELS[idx] = { ...MOCK_CAROUSELS[idx], ...data };
    return MOCK_CAROUSELS[idx];
  },

  // --- LÓGICA DE CONVERSIÓN DE DIVISAS ---

  getExchangeConfig: async (): Promise<ExchangeConfig> => {
    await new Promise(r => setTimeout(r, 200));
    return { ...MOCK_EXCHANGE };
  },

  updateExchangeConfig: async (baseRate: number, percentage: number): Promise<ExchangeConfig> => {
    await new Promise(r => setTimeout(r, 500));
    
    // Cálculo: Base + (Base * (Porcentaje / 100))
    const finalRate = baseRate + (baseRate * (percentage / 100));
    
    MOCK_EXCHANGE = {
      baseRate,
      percentage,
      finalRate,
      lastUpdated: new Date().toISOString()
    };

    // Actualización masiva de precios en productos
    MOCK_PRODUCTS.forEach(p => {
      p.priceBs = p.priceUsd * finalRate;
    });

    return MOCK_EXCHANGE;
  }
};
