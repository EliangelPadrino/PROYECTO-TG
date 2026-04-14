
/**
 * Archivo: pages/PublicPages.tsx
 * Propósito: Vistas públicas con filtros avanzados, carruseles dinámicos y flujo de pago completo.
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { mockService } from '../services/mockService';
import { Product, CarouselConfig, CartItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Heart, Search, ArrowRight, Trash2, CreditCard, 
  ChevronRight, Star, Clock, LayoutGrid, List as ListIcon, 
  Plus, Minus, CircleHelp, Tag, SlidersHorizontal, Gamepad2, Monitor, Wrench, Globe, Users,
  Landmark, DollarSign, Copy, Check, Upload, Image as ImageIcon, X, Wallet
} from 'lucide-react';
import { Badge } from '../components/Widgets';

/**
 * Componente para mostrar una tarjeta de producto con botón de compra funcional
 */
const ProductCard: React.FC<{ product: Product, viewMode?: 'grid' | 'list' }> = ({ product, viewMode = 'grid' }) => {
  const { currency, addToCart, toggleFavorite, favorites } = useStore();
  const navigate = useNavigate();
  const isFav = favorites.includes(product.id);

  const hasDiscount = !!product.discount && product.discount > 0;
  const finalPriceUsd = hasDiscount ? (product.priceUsd * (1 - product.discount! / 100)) : product.priceUsd;
  const finalPriceBs = hasDiscount ? (product.priceBs * (1 - product.discount! / 100)) : product.priceBs;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  if (viewMode === 'list') {
    return (
      <motion.div 
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-row h-52 group"
      >
        <div className="relative w-52 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          {hasDiscount && <div className="absolute top-2 left-2"><Badge color="bg-red-500">-{product.discount}%</Badge></div>}
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
             <div className="flex justify-between items-start">
               <div>
                  <div className="text-[10px] text-[#6A00FF] font-black mb-1 uppercase tracking-widest flex gap-2">
                    {product.type === 'game' ? 'JUEGO' : 'HARDWARE'} • {product.genres[0]}
                  </div>
                  <h3 className="text-gray-900 font-black text-xl mb-1 cursor-pointer hover:text-[#6A00FF]" onClick={() => navigate(`/product/${product.id}`)}>{product.title}</h3>
               </div>
               <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className={`p-2 rounded-full transition-colors ${isFav ? "text-red-500 bg-red-50" : "text-gray-300 hover:bg-gray-100"}`}>
                <Heart fill={isFav ? "currentColor" : "none"} size={20} />
              </button>
            </div>
            <p className="text-gray-400 text-xs line-clamp-2 mt-1">{product.description}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
             <div className="flex flex-col">
                {hasDiscount && (
                  <span className="text-gray-300 text-xs line-through font-bold">
                    {currency === 'USD' ? `$${product.priceUsd.toFixed(2)}` : `Bs ${product.priceBs.toFixed(2)}`}
                  </span>
                )}
                <span className="text-2xl font-black text-gray-900">
                  {currency === 'USD' ? `$${finalPriceUsd.toFixed(2)}` : `Bs ${finalPriceBs.toFixed(2)}`}
                </span>
             </div>
             <button onClick={handleAddToCart} className="bg-[#6A00FF] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#5b00db] flex items-center gap-2 active:scale-95 transition-all">
                <ShoppingCart size={18} /> Añadir
             </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full group hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300"
    >
      <div className="relative h-64 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product.id}`)}>
        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        {hasDiscount && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <Badge color="bg-red-500 font-black">OFERTA</Badge>
            <div className="bg-white text-red-500 font-black text-[10px] px-2 py-1 rounded-full shadow-sm">-{product.discount}%</div>
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }} className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur rounded-full text-gray-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart fill={isFav ? "currentColor" : "none"} size={18} />
        </button>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-tighter">{product.genres[0]} • {product.platforms[0]}</div>
        <h3 className="text-gray-900 font-bold text-lg mb-3 leading-tight line-clamp-2 cursor-pointer hover:text-[#6A00FF]" onClick={() => navigate(`/product/${product.id}`)}>{product.title}</h3>

        <div className="mt-auto flex items-end justify-between">
          <div className="flex flex-col">
            {hasDiscount && (
              <span className="text-gray-300 text-xs line-through font-bold">
                {currency === 'USD' ? `$${product.priceUsd.toFixed(2)}` : `Bs ${product.priceBs.toFixed(2)}`}
              </span>
            )}
            <span className="text-xl font-black text-gray-900">
              {currency === 'USD' ? `$${finalPriceUsd.toFixed(2)}` : `Bs ${finalPriceBs.toFixed(2)}`}
            </span>
          </div>
          <button onClick={handleAddToCart} className="p-3.5 bg-gray-900 text-white rounded-2xl hover:bg-[#6A00FF] transition-all shadow-lg active:scale-90">
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const HeroCarousel: React.FC = () => {
  return (
    <div className="relative h-[500px] w-full bg-gray-900 flex items-center overflow-hidden">
      <img src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80" alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-50" />
      <div className="relative max-w-7xl mx-auto px-4 w-full">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl">
          <Badge color="bg-[#6A00FF]">Especial de Invierno</Badge>
          <h1 className="text-5xl md:text-7xl font-black text-white mt-4 mb-6 leading-none">DOMINA EL <br /><span className="text-[#6A00FF]">JUEGO.</span></h1>
          <p className="text-gray-300 text-lg mb-8">Equípate con lo mejor en tecnología y software. Precios imbatibles para gamers de verdad.</p>
          <Link to="/catalog" className="bg-[#6A00FF] text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-[#5b00db] transition-all flex items-center gap-2 w-fit">Explorar Catálogo <ArrowRight size={20} /></Link>
        </motion.div>
      </div>
    </div>
  );
};

const ProductCarousel: React.FC<{ title: string, subtitle?: string, products: Product[], icon: any }> = ({ title, subtitle, products, icon: Icon }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <div className="flex items-center gap-2 text-[#6A00FF] font-black uppercase tracking-widest text-xs mb-2">
            <Icon size={16} /> {title}
          </div>
          <h2 className="text-3xl font-black text-gray-900">{subtitle}</h2>
        </div>
        <Link to="/catalog" className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#6A00FF] transition-colors">
          Ver todo <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
};

export const Home: React.FC = () => {
  const [products1, setProducts1] = useState<Product[]>([]);
  const [products2, setProducts2] = useState<Product[]>([]);
  const [products3, setProducts3] = useState<Product[]>([]);
  const [carouselConfigs, setCarouselConfigs] = useState<CarouselConfig[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const configs = await mockService.getCarousels();
      setCarouselConfigs(configs);
      const allProducts = await mockService.getProducts();
      if (configs[0]) setProducts1(allProducts.filter(p => configs[0].productIds.includes(p.id)));
      if (configs[1]) setProducts2(allProducts.filter(p => configs[1].productIds.includes(p.id)));
      if (configs[2]) setProducts3(allProducts.filter(p => configs[2].productIds.includes(p.id)));
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen pb-20 bg-white">
      <HeroCarousel />
      {carouselConfigs[0] && <ProductCarousel title={carouselConfigs[0].title} subtitle={carouselConfigs[0].subtitle} products={products1} icon={Star} />}
      {carouselConfigs[1] && (
        <div className="bg-gray-50/50 py-4">
          <ProductCarousel title={carouselConfigs[1].title} subtitle={carouselConfigs[1].subtitle} products={products2} icon={Tag} />
        </div>
      )}
      {carouselConfigs[2] && <ProductCarousel title={carouselConfigs[2].title} subtitle={carouselConfigs[2].subtitle} products={products3} icon={Clock} />}
    </div>
  );
};

export const Catalog: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('all');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [modality, setModality] = useState('');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');

  const genres = ["RPG", "Acción", "Aventura", "Deportes", "Simulación", "Estrategia", "Shooter"];
  const platforms = ["PS5", "Xbox", "Switch", "PC"];
  const modalities = ["Individual", "Multijugador", "Online", "Cooperativo"];

  const categories = [
    { id: 'all', name: 'Todo', icon: LayoutGrid },
    { id: 'game', name: 'Juegos', icon: Gamepad2 },
    { id: 'console', name: 'Consolas', icon: Monitor },
    { id: 'accessory', name: 'Accesorios', icon: Wrench },
  ];

  useEffect(() => {
    mockService.getProducts({ q: search, type, genre, platform, priceMax: maxPrice }).then(allProducts => {
      let filtered = [...allProducts];
      if (modality) filtered = filtered.filter(p => p.modes.includes(modality));
      if (sortBy === 'price-asc') filtered.sort((a, b) => a.priceUsd - b.priceUsd);
      if (sortBy === 'price-desc') filtered.sort((a, b) => b.priceUsd - a.priceUsd);
      if (sortBy === 'name-asc') filtered.sort((a, b) => a.title.localeCompare(b.title));
      if (sortBy === 'name-desc') filtered.sort((a, b) => b.title.localeCompare(a.title));
      setProducts(filtered);
    });
  }, [search, type, genre, platform, maxPrice, modality, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-72 space-y-10">
           <div className="space-y-3">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Buscador</h4>
              <div className="relative">
                  <input type="text" placeholder="¿Qué buscas hoy?..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:ring-2 focus:ring-[#6A00FF] transition-all font-medium" />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              </div>
           </div>
           <div className="space-y-4">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Categoría</h4>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button key={cat.id} onClick={() => setType(cat.id)} className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-2 ${type === cat.id ? 'bg-[#6A00FF] border-[#6A00FF] text-white shadow-lg shadow-purple-200' : 'bg-white border-gray-50 text-gray-400 hover:border-purple-100'}`}>
                      <Icon size={24} />
                      <span className="text-[10px] font-black uppercase">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
           </div>
           <div className="space-y-4 bg-gray-50 p-6 rounded-[32px] border border-gray-100">
              <div className="flex justify-between items-center"><h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Precio Máximo</h4><span className="text-sm font-black text-[#6A00FF]">${maxPrice}</span></div>
              <input type="range" min="10" max="1000" step="10" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="w-full accent-[#6A00FF] cursor-pointer" />
           </div>
           <div className="space-y-4">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Género</h4>
              <select value={genre} onChange={e => setGenre(e.target.value)} className="w-full bg-white border border-gray-100 rounded-2xl px-4 py-3.5 outline-none focus:ring-2 focus:ring-[#6A00FF] font-bold text-sm text-gray-600 appearance-none shadow-sm" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236A00FF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}>
                <option value="">Todos los géneros</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
           </div>
           <div className="space-y-4">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Plataforma</h4>
              <div className="flex flex-wrap gap-2">
                {platforms.map(p => (
                  <button key={p} onClick={() => setPlatform(platform === p ? '' : p)} className={`px-4 py-2.5 rounded-2xl text-[10px] font-black border-2 transition-all ${platform === p ? 'bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-100 text-gray-400'}`}>{p}</button>
                ))}
              </div>
           </div>
           <div className="space-y-4">
              <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-gray-400">Modalidad</h4>
              <div className="grid grid-cols-1 gap-2">
                {modalities.map(m => (
                  <button key={m} onClick={() => setModality(modality === m ? '' : m)} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold border-2 transition-all ${modality === m ? 'bg-purple-50 border-[#6A00FF] text-[#6A00FF]' : 'bg-white border-gray-50 text-gray-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${modality === m ? 'bg-[#6A00FF]' : 'bg-gray-200'}`} /> {m}
                  </button>
                ))}
              </div>
           </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
             <div><h2 className="text-3xl font-black text-gray-900">{products.length} Resultados</h2><p className="text-gray-400 text-sm font-medium">Explora lo mejor de nuestra galaxia gaming</p></div>
             <div className="flex items-center gap-4 w-full sm:w-auto">
                <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[#6A00FF] appearance-none cursor-pointer">
                    <option value="featured">Destacados</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="name-asc">Nombre: A-Z</option>
                    <option value="name-desc">Nombre: Z-A</option>
                </select>
                <div className="flex bg-gray-100 p-1 rounded-2xl">
                    <button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-xl ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#6A00FF]' : 'text-gray-400'}`}><LayoutGrid size={20}/></button>
                    <button onClick={() => setViewMode('list')} className={`p-2.5 rounded-xl ${viewMode === 'list' ? 'bg-white shadow-sm text-[#6A00FF]' : 'text-gray-400'}`}><ListIcon size={20}/></button>
                </div>
             </div>
          </div>
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            <AnimatePresence>
              {products.length > 0 ? products.map(p => <ProductCard key={p.id} product={p} viewMode={viewMode} />) : <div className="col-span-full py-24 text-center bg-gray-50 rounded-[48px] border-2 border-dashed border-gray-200"><h3 className="text-xl font-black text-gray-900">Sin coincidencias</h3></div>}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const { currency, addToCart, toggleFavorite, favorites } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) mockService.getProductById(Number(id)).then(p => p ? setProduct(p) : navigate('/catalog'));
  }, [id, navigate]);

  if (!product) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-900">Preparando tu equipo...</div>;

  const hasDiscount = (product.discount || 0) > 0;
  const finalPriceUsd = hasDiscount ? (product.priceUsd * (1 - product.discount! / 100)) : product.priceUsd;
  const finalPriceBs = hasDiscount ? (product.priceBs * (1 - product.discount! / 100)) : product.priceBs;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="rounded-[40px] overflow-hidden bg-gray-100 aspect-square shadow-2xl sticky top-24 relative">
          {hasDiscount && <div className="absolute top-6 left-6 z-10 bg-red-500 text-white font-black px-4 py-2 rounded-xl text-lg shadow-lg">AHORRAS {product.discount}%</div>}
          <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-xs font-black text-[#6A00FF] uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><Badge>{product.type}</Badge> {product.genres.join(' • ')}</div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">{product.title}</h1>
          <p className="text-gray-500 mb-10 text-lg leading-relaxed">{product.description}</p>
          <div className="flex items-center gap-6 mb-10">
            <div className="flex flex-col">
              {hasDiscount && <span className="text-gray-400 line-through font-bold text-lg">{currency === 'USD' ? `$${product.priceUsd.toFixed(2)}` : `Bs ${product.priceBs.toFixed(2)}`}</span>}
              <span className={`text-6xl font-black ${hasDiscount ? 'text-red-500' : 'text-gray-900'}`}>{currency === 'USD' ? `$${finalPriceUsd.toFixed(2)}` : `Bs ${finalPriceBs.toFixed(2)}`}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center border-2 border-gray-100 rounded-[20px] p-1.5 bg-white">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-3 text-[#6A00FF]"><Minus size={22} /></button>
              <span className="w-16 text-center font-black text-black text-2xl">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-3 text-[#6A00FF]"><Plus size={22} /></button>
            </div>
            <button onClick={() => addToCart(product, qty)} className="flex-1 min-w-[240px] bg-[#6A00FF] text-white py-5 rounded-[24px] font-black text-xl hover:bg-[#5b00db] transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"><ShoppingCart size={24} /> Añadir al Carrito</button>
            <button onClick={() => toggleFavorite(product.id)} className={`p-5 rounded-[24px] border-2 transition-all ${favorites.includes(product.id) ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-gray-100 text-gray-400'}`}><Heart fill={favorites.includes(product.id) ? "currentColor" : "none"} size={30} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, currency, cartTotalUsd, cartTotalBs, clearCart, user } = useStore();
  const navigate = useNavigate();
  
  // Estados del modal de pago
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Select, 2: Details, 3: Evidence
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [refNumber, setRefNumber] = useState('');
  const [screenshot, setScreenshot] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethods = [
    { id: 'pagomovil', name: 'Pago Móvil', icon: Wallet, details: "Tel: 0422-445.99.38\nC.I: 30.050.385\nBanco: Mercantil (0105)" },
    { id: 'transfer', name: 'Transferencia Bancaria', icon: Landmark, details: "Cuenta: 0105 0121 1111 2106 0684\nC.I: 30.050.385\nNombre: Eliángel Padrino" },
    { id: 'binance', name: 'Binance (USDT)', icon: CircleHelp, details: "Email: eliangel901@gmail.com" },
    { id: 'zelle', name: 'Zelle', icon: CreditCard, details: "Email: eliangel901@gmail.com" },
    { id: 'cash', name: 'Efectivo', icon: DollarSign, details: "Pago en tienda física o contra entrega." }
  ];

  const handleCopyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    setIsCheckoutModalOpen(true);
    setCheckoutStep(1);
  };

  const finalizeOrder = async () => {
    if (!refNumber && selectedMethod !== 'cash') { alert("Por favor ingresa el número de referencia."); return; }
    setIsSubmitting(true);
    try {
      await mockService.createOrder({
        userId: user!.id,
        items: cart,
        totalUsd: cartTotalUsd,
        totalBs: cartTotalBs,
        paymentMethod: selectedMethod!,
        paymentRef: refNumber,
        paymentScreenshot: screenshot || 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80' // Placeholder if empty
      });
      clearCart();
      setIsCheckoutModalOpen(false);
      alert("¡Pedido realizado con éxito! Un administrador verificará tu pago.");
      navigate('/');
    } catch (e) {
      alert("Error al procesar pedido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <div className="bg-gray-50 p-16 rounded-full mb-10 text-gray-200"><ShoppingCart size={100} /></div>
      <h2 className="text-4xl font-black text-gray-900 mb-4">Tu carrito está esperando</h2>
      <Link to="/catalog" className="bg-[#6A00FF] text-white px-12 py-5 rounded-[24px] font-black text-xl hover:bg-[#5b00db] transition-all shadow-2xl">Ver Catálogo</Link>
    </div>
  );

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-black text-gray-900 mb-12 flex items-center gap-6"><div className="bg-[#6A00FF]/10 p-4 rounded-3xl"><ShoppingCart size={48} className="text-[#6A00FF]" /></div> Mi Carrito</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {cart.map(item => {
            const hasDiscount = (item.product.discount || 0) > 0;
            const originalPrice = currency === 'USD' ? item.product.priceUsd : item.product.priceBs;
            const finalPrice = hasDiscount ? originalPrice * (1 - item.product.discount! / 100) : originalPrice;

            return (
              <div key={item.productId} className="bg-white p-6 rounded-[40px] border border-gray-100 flex flex-col sm:flex-row items-center gap-8 shadow-sm group relative overflow-hidden">
                {hasDiscount && <div className="absolute top-0 right-0 bg-red-500 text-white font-black text-sm px-4 py-1 rounded-bl-2xl">DESC. -{item.product.discount}%</div>}
                <img src={item.product.images[0]} className="w-32 h-44 object-cover rounded-[32px] group-hover:scale-105 transition-transform" alt={item.product.title} />
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-black text-gray-900 text-2xl mb-2">{item.product.title}</h3>
                  <div className="flex flex-col sm:items-start items-center">
                    {hasDiscount && <span className="text-gray-400 line-through font-bold text-sm">{currency === 'USD' ? `$${originalPrice.toFixed(2)}` : `Bs ${originalPrice.toFixed(2)}`}</span>}
                    <div className={`${hasDiscount ? 'text-red-500' : 'text-[#6A00FF]'} font-black text-xl`}>
                      {currency === 'USD' ? `$${finalPrice.toFixed(2)}` : `Bs ${finalPrice.toFixed(2)}`}
                    </div>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.productId)} className="p-4 text-red-400 hover:text-red-600 active:scale-90 transition-all"><Trash2 size={28}/></button>
              </div>
            );
          })}
        </div>
        <div className="bg-gray-900 text-white p-12 rounded-[56px] h-fit sticky top-24 shadow-2xl">
           <h3 className="text-3xl font-black mb-10">Resumen</h3>
           <div className="space-y-6 mb-12">
              <div className="flex justify-between items-center text-gray-400 text-sm"><span>Monto en Dólares</span><span>${cartTotalUsd.toFixed(2)}</span></div>
              <div className="flex justify-between items-center text-gray-400 text-sm"><span>Monto en Bolívares</span><span>Bs {cartTotalBs.toFixed(2)}</span></div>
              <div className="h-px bg-white/10 my-6"></div>
              <div className="flex justify-between text-4xl font-black"><span>Total</span><span className="text-[#6A00FF]">{currency === 'USD' ? `$${cartTotalUsd.toFixed(2)}` : `Bs ${cartTotalBs.toFixed(2)}`}</span></div>
           </div>
           <button onClick={handleCheckout} className="w-full bg-[#6A00FF] py-7 rounded-[28px] font-black text-2xl hover:bg-[#5b00db] transition-all flex items-center justify-center gap-4 group shadow-xl shadow-purple-900/40">Pagar ahora <ArrowRight className="group-hover:translate-x-2 transition-transform" size={28}/></button>
        </div>
      </div>

      {/* MODAL DE PAGO MULTI-PASO */}
      <AnimatePresence>
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCheckoutModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              className="relative bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-[#6A00FF] p-8 text-white flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-black">Finalizar Compra</h2>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70">Paso {checkoutStep} de 3</p>
                 </div>
                 <button onClick={() => setIsCheckoutModalOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-all"><X size={24}/></button>
              </div>

              <div className="p-8">
                {/* PASO 1: Selección de Método */}
                {checkoutStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-gray-900">Elige tu método de pago</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {paymentMethods.map(m => (
                        <button 
                          key={m.id} 
                          onClick={() => { setSelectedMethod(m.id); setCheckoutStep(2); }}
                          className="flex items-center gap-4 p-5 rounded-3xl border-2 border-gray-50 hover:border-[#6A00FF] hover:bg-purple-50 transition-all group text-left"
                        >
                          <div className="bg-purple-50 text-[#6A00FF] p-3 rounded-2xl group-hover:bg-[#6A00FF] group-hover:text-white transition-all"><m.icon size={24}/></div>
                          <span className="font-black text-gray-900">{m.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PASO 2: Detalles de Pago y Copiado */}
                {checkoutStep === 2 && selectedMethodData && (
                  <div className="space-y-8">
                    <button onClick={() => setCheckoutStep(1)} className="text-[#6A00FF] font-black text-xs flex items-center gap-2 mb-4 hover:underline"><ArrowRight className="rotate-180" size={14}/> VOLVER A MÉTODOS</button>
                    
                    <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-xl">
                       <h3 className="text-2xl font-black mb-6 text-[#6A00FF] flex items-center gap-3"><selectedMethodData.icon size={28}/> {selectedMethodData.name}</h3>
                       <div className="space-y-4">
                          <p className="text-xs font-black uppercase tracking-widest text-gray-400">Datos para la transferencia:</p>
                          <div className="bg-white/5 p-6 rounded-2xl relative font-mono text-sm leading-relaxed border border-white/10 group">
                             {selectedMethodData.details.split('\n').map((line, i) => (
                               <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-none">
                                  <span>{line}</span>
                                  <button 
                                    onClick={() => handleCopyToClipboard(line.split(': ')[1] || line, `field-${i}`)}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-all text-[#6A00FF]"
                                  >
                                     {copiedField === `field-${i}` ? <Check size={16}/> : <Copy size={16}/>}
                                  </button>
                               </div>
                             ))}
                             <button 
                                onClick={() => handleCopyToClipboard(selectedMethodData.details, 'all')}
                                className="mt-4 w-full py-3 bg-[#6A00FF] rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#5b00db] transition-all flex items-center justify-center gap-2"
                             >
                                {copiedField === 'all' ? <Check size={16}/> : <Copy size={16}/>} COPIAR TODOS LOS DATOS
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total USD</p>
                          <p className="text-2xl font-black text-gray-900">${cartTotalUsd.toFixed(2)}</p>
                       </div>
                       <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total BS</p>
                          <p className="text-2xl font-black text-[#6A00FF]">Bs {cartTotalBs.toFixed(2)}</p>
                       </div>
                    </div>

                    <button 
                      onClick={() => setCheckoutStep(3)}
                      className="w-full bg-[#6A00FF] text-white py-6 rounded-[24px] font-black text-xl hover:bg-[#5b00db] transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-purple-100"
                    >
                      PAGO REALIZADO <ArrowRight size={24}/>
                    </button>
                  </div>
                )}

                {/* PASO 3: Evidencia de Pago */}
                {checkoutStep === 3 && (
                  <div className="space-y-8">
                    <button onClick={() => setCheckoutStep(2)} className="text-[#6A00FF] font-black text-xs flex items-center gap-2 mb-4 hover:underline"><ArrowRight className="rotate-180" size={14}/> REVISAR DATOS DE PAGO</button>
                    
                    <div className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Número de Referencia</label>
                          <input 
                            type="text" 
                            required
                            value={refNumber}
                            onChange={e => setRefNumber(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6A00FF] p-5 rounded-3xl outline-none font-black text-lg text-black transition-all"
                            placeholder="Ej: 123456789"
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Capture de Pantalla / Screenshot</label>
                          <div className="relative border-4 border-dashed border-gray-100 rounded-[32px] p-12 flex flex-col items-center justify-center bg-gray-50 hover:bg-purple-50 transition-all cursor-pointer overflow-hidden">
                             {screenshot ? (
                               <div className="absolute inset-0 group">
                                  <img src={screenshot} className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                     <button onClick={() => setScreenshot('')} className="bg-red-500 text-white p-4 rounded-full"><Trash2 size={24}/></button>
                                  </div>
                               </div>
                             ) : (
                               <>
                                  <Upload className="text-[#6A00FF] mb-4" size={48}/>
                                  <p className="font-black text-gray-400 text-sm">SUBIR COMPROBANTE</p>
                                  <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={e => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => setScreenshot(reader.result as string);
                                        reader.readAsDataURL(file);
                                      }
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                  />
                               </>
                             )}
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={finalizeOrder}
                      disabled={isSubmitting}
                      className="w-full bg-gray-900 text-white py-6 rounded-[24px] font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl disabled:opacity-50"
                    >
                      {isSubmitting ? 'PROCESANDO...' : <>ENVIAR PARA VERIFICACIÓN <Check size={24}/></>}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const About: React.FC = () => <div className="max-w-5xl mx-auto px-4 py-24 text-center"><h1 className="text-7xl font-black text-gray-900 mb-8">Nuestra <span className="galaxy-text">Misión.</span></h1><p className="text-gray-500 text-2xl font-medium max-w-2xl mx-auto">Redefiniendo el acceso al gaming de alto nivel en todo el país.</p></div>;
export const FAQ: React.FC = () => <div className="max-w-4xl mx-auto px-4 py-24 text-center"><h1 className="text-6xl font-black text-gray-900 mb-6">Centro de Ayuda</h1><p className="text-gray-400 text-xl font-medium">Todo lo que necesitas saber para tu próxima aventura</p></div>;
export const FavoritesPage: React.FC = () => {
  const { favorites } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { mockService.getProducts().then(all => setProducts(all.filter(p => favorites.includes(p.id)))); }, [favorites]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-black text-gray-900 mb-16 flex items-center gap-6"><div className="bg-red-50 p-5 rounded-[32px]"><Heart size={48} className="text-red-500" fill="currentColor" /></div> Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
    </div>
  );
};
