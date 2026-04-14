
/**
 * Archivo: pages/AdminDashboard.tsx
 * Propósito: Gestión completa de inventario, pedidos detallados, usuarios, descuentos y personalización de la Home.
 */
import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { mockService } from '../services/mockService';
import { Product, Notification, Order, CarouselConfig, User, ExchangeConfig } from '../types';
import { useNavigate } from 'react-router-dom';
import { 
  Package, Users, ChartBar, CircleAlert, Bell, ShoppingBag, 
  Eye, Plus, X, Tag, Percent, Save, Trash2, Home, Layout, 
  Edit3, CheckSquare, Square, Search, Layers, Type, Subtitles,
  ChevronRight, Calendar, CreditCard, ExternalLink, Image as ImageIcon,
  User as UserIcon, Phone, Mail, RefreshCw, Banknote, Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const { user } = useStore();
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [carousels, setCarousels] = useState<CarouselConfig[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [exchangeConfig, setExchangeConfig] = useState<ExchangeConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'users' | 'products' | 'discounts' | 'home_setup' | 'conversion'>('dashboard');
  
  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [editingCarousel, setEditingCarousel] = useState<CarouselConfig | null>(null);
  const [modalSearch, setModalSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // State for Editing Product
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for Exchange
  const [tempExchange, setTempExchange] = useState({ baseRate: 0, percentage: 0 });
  
  // Estado extendido para el nuevo producto / edición
  const [newProd, setNewProd] = useState<Partial<Product> & { tempImage: string, tempGenres: string, tempModes: string, tempPlatforms: string, tempDeveloper: string, tempYear: string }>({
    title: '', priceUsd: 0, discount: 0, type: 'game', stock: 10,
    description: '', genres: [], platforms: [], modes: [], images: [],
    features: {},
    tempImage: '', tempGenres: '', tempModes: '', tempPlatforms: '', tempDeveloper: '', tempYear: ''
  });

  const loadData = async () => {
    const [m, p, o, c, u, e] = await Promise.all([
      mockService.getMetrics(),
      mockService.getProducts(),
      mockService.getOrders(),
      mockService.getCarousels(),
      mockService.getUsers(),
      mockService.getExchangeConfig()
    ]);
    setMetrics(m);
    setProducts(p);
    setOrders(o);
    setCarousels(c);
    setUsersList(u);
    setExchangeConfig(e);
    setTempExchange({ baseRate: e.baseRate, percentage: e.percentage });
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadData();
  }, [user]);

  // Función auxiliar para cerrar modal y limpiar formulario
  const closeModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setNewProd({
        title: '', priceUsd: 0, discount: 0, type: 'game', stock: 10,
        description: '', genres: [], platforms: [], modes: [], images: [],
        features: {},
        tempImage: '', tempGenres: '', tempModes: '', tempPlatforms: '', tempDeveloper: '', tempYear: ''
    });
  };

  // Función para abrir el modal en modo edición
  const openEditModal = (p: Product) => {
    setNewProd({
      title: p.title,
      priceUsd: p.priceUsd,
      discount: p.discount || 0,
      type: p.type,
      stock: p.stock,
      description: p.description,
      genres: p.genres,
      platforms: p.platforms,
      modes: p.modes,
      images: p.images,
      features: p.features,
      // Mapeo a campos temporales (inputs de texto)
      tempImage: p.images[0] || '',
      tempGenres: p.genres.join(', '),
      tempModes: p.modes.join(', '),
      tempPlatforms: p.platforms.join(', '),
      tempDeveloper: p.features.developer || '',
      tempYear: p.features.year || ''
    });
    setEditingId(p.id);
    setShowAddModal(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Procesar datos antes de enviar
      const productToSave: Partial<Product> = {
        title: newProd.title,
        priceUsd: newProd.priceUsd,
        discount: newProd.discount,
        type: newProd.type,
        stock: newProd.stock,
        description: newProd.description,
        images: newProd.tempImage ? [newProd.tempImage] : [],
        genres: newProd.tempGenres.split(',').map(s => s.trim()).filter(s => s),
        modes: newProd.tempModes.split(',').map(s => s.trim()).filter(s => s),
        platforms: newProd.tempPlatforms.split(',').map(s => s.trim()).filter(s => s),
        features: {
           developer: newProd.tempDeveloper,
           year: newProd.tempYear
        }
      };

      if (editingId) {
        await mockService.updateProduct(editingId, productToSave);
      } else {
        await mockService.addProduct(productToSave);
      }
      
      closeModal();
      await loadData();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función dedicada para eliminar productos
  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto permanentemente? Esta acción no se puede deshacer.')) {
      try {
        await mockService.deleteProduct(id);
        
        // Actualizar estado local inmediatamente para feedback visual rápido
        setProducts(prev => prev.filter(p => p.id !== id));
        
        // Recargar datos completos para sincronizar métricas en segundo plano
        loadData();
      } catch (error) {
        console.error("Error eliminando producto:", error);
        alert("Ocurrió un error al intentar eliminar el producto.");
      }
    }
  };

  const handleMarkOrderAsPaid = async (orderId: number) => {
    if (confirm('¿Confirmar pago y descontar stock del inventario?')) {
      try {
        await mockService.updateOrderStatus(orderId, 'paid');
        alert('Pedido marcado como pagado. Stock actualizado.');
        setSelectedOrder(null);
        await loadData();
      } catch (e) {
        console.error(e);
        alert('Error al actualizar el pedido');
      }
    }
  };

  const handleMarkOrderAsRejected = async (orderId: number) => {
    if (confirm('¿Estás seguro de que deseas rechazar este pedido?')) {
      try {
        await mockService.updateOrderStatus(orderId, 'rejected');
        alert('Pedido rechazado.');
        setSelectedOrder(null);
        await loadData();
      } catch (e) {
        console.error(e);
        alert('Error al rechazar el pedido');
      }
    }
  };

  const updateDiscount = async (id: number, discount: number) => {
    await mockService.updateProduct(id, { discount });
    await loadData();
  };

  const handleCarouselUpdate = async (id: number, data: Partial<CarouselConfig>) => {
    await mockService.updateCarousel(id, data);
    await loadData();
  };

  const handleToggleInModal = async (productId: number) => {
    if (!editingCarousel) return;
    let newIds = [...editingCarousel.productIds];
    if (newIds.includes(productId)) {
      newIds = newIds.filter(id => id !== productId);
    } else {
      newIds.push(productId);
    }
    const updated = { ...editingCarousel, productIds: newIds };
    setEditingCarousel(updated);
    await handleCarouselUpdate(editingCarousel.id, { productIds: newIds });
  };

  const handleUpdateExchange = async () => {
    setIsSubmitting(true);
    try {
        await mockService.updateExchangeConfig(tempExchange.baseRate, tempExchange.percentage);
        await loadData(); // Recarga para ver precios actualizados
        alert('Tasa actualizada y precios recalculados correctamente.');
    } catch (e) {
        alert('Error actualizando tasa');
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!metrics) return <div className="min-h-screen flex items-center justify-center text-gray-900 font-bold">Iniciando sistemas...</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-[#6A00FF]">
                  <Layout size={28}/>
               </div>
               <h1 className="text-3xl font-black text-gray-900">Admin <span className="text-[#6A00FF]">Central</span></h1>
            </div>
            <div className="flex bg-white rounded-2xl p-1.5 border border-gray-100 shadow-xl overflow-x-auto max-w-full no-scrollbar">
                {[
                  { id: 'dashboard', label: 'Resumen' },
                  { id: 'orders', label: 'Pedidos' },
                  { id: 'users', label: 'Usuarios' },
                  { id: 'products', label: 'Inventario' },
                  { id: 'discounts', label: 'Ofertas' },
                  { id: 'conversion', label: 'Conversión' },
                  { id: 'home_setup', label: 'Config. Inicio' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)} 
                    className={`px-8 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#6A00FF] text-white shadow-lg shadow-purple-200' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
                  >
                    {tab.label}
                  </button>
                ))}
            </div>
        </div>

        {/* --- VIEWS --- */}
        
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <MetricCard title="Productos" val={metrics.totalProducts} icon={Package} color="bg-purple-100 text-[#6A00FF]" />
            <MetricCard title="Usuarios" val={metrics.totalUsers} icon={Users} color="bg-blue-100 text-blue-600" />
            <MetricCard title="Ventas Mes" val={`$${metrics.monthlySales}`} icon={ChartBar} color="bg-green-100 text-green-600" />
            <MetricCard title="Stock Bajo" val={metrics.lowStock} icon={CircleAlert} color="bg-red-100 text-red-600" />
          </div>
        )}

        {activeTab === 'users' && (
           <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-50">
                <h2 className="font-black text-2xl text-gray-900">Base de Datos de Pilotos</h2>
                <p className="text-gray-400 text-sm font-medium">Lista completa de usuarios registrados</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Usuario</th>
                      <th className="px-8 py-5">Nombre Completo</th>
                      <th className="px-8 py-5">Teléfono</th>
                      <th className="px-8 py-5">Correo Electrónico</th>
                      <th className="px-8 py-5">Rol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {usersList.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5 font-black text-gray-900 flex items-center gap-2">
                           <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[#6A00FF]"><UserIcon size={14}/></div>
                           @{u.username}
                        </td>
                        <td className="px-8 py-5 font-medium text-gray-600">{u.firstName} {u.lastName}</td>
                        <td className="px-8 py-5 font-medium text-gray-500">
                           <span className="flex items-center gap-2"><Phone size={14}/> {u.phone || 'N/A'}</span>
                        </td>
                        <td className="px-8 py-5 font-medium text-gray-500">
                           <span className="flex items-center gap-2"><Mail size={14}/> {u.email}</span>
                        </td>
                        <td className="px-8 py-5">
                           <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${u.role === 'admin' ? 'bg-purple-100 text-[#6A00FF]' : 'bg-gray-100 text-gray-500'}`}>
                             {u.role}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="p-8 border-b border-gray-50">
                <h2 className="font-black text-2xl text-gray-900">Gestión de Pedidos</h2>
                <p className="text-gray-400 text-sm font-medium">Verificación de pagos y detalles de transacción</p>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Producto(s)</th>
                      <th className="px-8 py-5">Precio Compra</th>
                      <th className="px-8 py-5">Referencia</th>
                      <th className="px-8 py-5">Screenshot</th>
                      <th className="px-8 py-5">Estado</th>
                      <th className="px-8 py-5 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.length > 0 ? orders.map(order => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-8 py-5">
                          <div className="space-y-3">
                            {order.items.map(item => (
                              <div key={item.productId} className="flex items-center gap-3">
                                <img src={item.product.images[0]} className="w-10 h-14 object-cover rounded-lg border shadow-sm" />
                                <div>
                                   <p className="font-black text-gray-900 text-sm line-clamp-1">{item.product.title}</p>
                                   <p className="text-[10px] text-gray-400 font-bold">Cant: {item.qty}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="font-black text-gray-900">${order.totalUsd.toFixed(2)}</div>
                          <div className="text-[10px] text-gray-400 font-bold">Bs {order.totalBs.toFixed(2)}</div>
                        </td>
                        <td className="px-8 py-5 font-black text-gray-500 text-sm">
                           {order.paymentRef || 'N/A'}
                        </td>
                        <td className="px-8 py-5">
                           {order.paymentScreenshot ? (
                             <button 
                               onClick={() => window.open(order.paymentScreenshot, '_blank')}
                               className="flex items-center gap-2 bg-gray-100 p-2 rounded-xl text-[#6A00FF] font-black text-[10px] hover:bg-purple-50 transition-all"
                             >
                                <ImageIcon size={14}/> VER CAPTURE
                             </button>
                           ) : <span className="text-gray-300">Sin imagen</span>}
                        </td>
                        <td className="px-8 py-5">
                           <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                             order.status === 'paid' ? 'bg-green-100 text-green-600' : 
                             order.status === 'rejected' ? 'bg-red-100 text-red-600' :
                             'bg-orange-100 text-orange-600'
                           }`}>
                             {order.status === 'rejected' ? 'Rechazado' : order.status}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <button onClick={() => setSelectedOrder(order)} className="p-2 bg-gray-100 rounded-xl text-gray-400 hover:text-[#6A00FF] transition-all"><Eye size={18}/></button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center">
                           <ShoppingBag className="mx-auto text-gray-100 mb-4" size={48}/>
                           <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No hay pedidos registrados</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'conversion' && (
          <div className="flex flex-col lg:flex-row gap-12 items-start">
             <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100 w-full lg:w-1/2 relative overflow-hidden">
                <Banknote className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-5 text-[#6A00FF] rotate-12" />
                <h2 className="text-3xl font-black text-gray-900 mb-2">Configuración de Divisa</h2>
                <p className="text-gray-500 mb-8 font-medium">Ajusta la tasa de cambio global para la tienda.</p>

                <div className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio del Dólar (Bs)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          step="0.01"
                          value={tempExchange.baseRate}
                          onChange={e => setTempExchange({...tempExchange, baseRate: parseFloat(e.target.value)})}
                          className="w-full bg-gray-50 p-4 pl-12 rounded-2xl font-black text-2xl text-gray-900 outline-none focus:ring-2 focus:ring-[#6A00FF]" 
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Bs</span>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Porcentaje Adicional (%)</label>
                      <div className="relative">
                        <input 
                          type="number"
                          step="0.01" 
                          value={tempExchange.percentage}
                          onChange={e => setTempExchange({...tempExchange, percentage: parseFloat(e.target.value)})}
                          className="w-full bg-gray-50 p-4 pl-12 rounded-2xl font-black text-2xl text-gray-900 outline-none focus:ring-2 focus:ring-[#6A00FF]" 
                        />
                         <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                      </div>
                   </div>

                   <button 
                     disabled={isSubmitting}
                     onClick={handleUpdateExchange}
                     className="w-full bg-[#6A00FF] text-white py-5 rounded-2xl font-black text-xl hover:bg-[#5b00db] transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-200 mt-4 active:scale-95 disabled:opacity-70"
                   >
                      {isSubmitting ? 'ACTUALIZANDO...' : <><RefreshCw size={24}/> ACTUALIZAR TASA GLOBAL</>}
                   </button>
                </div>
             </div>

             <div className="bg-gray-900 text-white p-10 rounded-[40px] shadow-2xl w-full lg:w-1/2 relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                <Calculator className="absolute right-[-40px] bottom-[-40px] w-64 h-64 opacity-10" />
                
                <h3 className="text-xl font-bold mb-8 text-gray-400 uppercase tracking-widest">Vista Previa del Cálculo</h3>
                
                <div className="space-y-8 relative z-10">
                   <div className="flex justify-between items-center text-lg">
                      <span className="font-medium opacity-60">Precio Base</span>
                      <span className="font-black text-2xl">Bs {tempExchange.baseRate.toFixed(2)}</span>
                   </div>
                   
                   <div className="flex justify-between items-center text-lg">
                      <span className="font-medium opacity-60">Incremento ({tempExchange.percentage}%)</span>
                      <span className="font-black text-2xl text-[#6A00FF]">+ Bs {(tempExchange.baseRate * (tempExchange.percentage / 100)).toFixed(2)}</span>
                   </div>

                   <div className="h-px bg-white/10 w-full"></div>

                   <div className="flex justify-between items-center">
                      <span className="font-bold text-xl uppercase text-gray-300">Valor Final del Dólar</span>
                      <span className="font-black text-5xl text-white">
                        Bs {(tempExchange.baseRate + (tempExchange.baseRate * (tempExchange.percentage / 100))).toFixed(2)}
                      </span>
                   </div>
                </div>

                <div className="mt-12 bg-white/5 p-4 rounded-xl border border-white/10 text-xs text-gray-400 leading-relaxed">
                   <p><strong className="text-white">Nota:</strong> Al actualizar, todos los productos en el inventario recalcularán su precio en Bolívares automáticamente basándose en su precio en USD y esta nueva tasa.</p>
                </div>
             </div>
          </div>
        )}

        {/* --- REST OF TABS (PRODUCTS, DISCOUNTS, HOME_SETUP) --- */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
              <div>
                <h2 className="font-black text-2xl text-gray-900">Control de Inventario</h2>
                <p className="text-gray-400 text-sm font-medium">Gestiona tu stock galáctico</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-[#6A00FF] text-white px-6 py-4 rounded-2xl flex items-center gap-2 font-black hover:bg-[#5b00db] transition-all shadow-lg shadow-purple-100 active:scale-95"
              >
                <Plus size={20}/> Nuevo Articulo
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                  <tr>
                    <th className="px-8 py-5">Producto</th>
                    <th className="px-8 py-5">Tipo</th>
                    <th className="px-8 py-5">Precio</th>
                    <th className="px-8 py-5">Stock</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td 
                        onClick={() => navigate(`/product/${p.id}`)}
                        className="px-8 py-5 flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                        title="Ver en tienda"
                      >
                        <img src={p.images[0]} className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm" />
                        <span className="font-black text-gray-900">{p.title}</span>
                        <ExternalLink size={12} className="text-gray-400" />
                      </td>
                      <td className="px-8 py-5">
                         <span className="text-xs font-black uppercase text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{p.type}</span>
                      </td>
                      <td className="px-8 py-5 font-black text-gray-900">${p.priceUsd}</td>
                      <td className="px-8 py-5">
                        <div className={`text-sm font-black flex items-center gap-2 ${p.stock <= 5 ? 'text-red-500' : 'text-green-500'}`}>
                           <div className={`w-1.5 h-1.5 rounded-full ${p.stock <= 5 ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                           {p.stock} Unid.
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => openEditModal(p)}
                            className="p-2 text-[#6A00FF] hover:bg-purple-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit3 size={20} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar producto"
                          >
                            <Trash2 size={20}/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'discounts' && (
          <div className="space-y-8">
            <div className="bg-[#6A00FF] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                <Tag className="absolute right-[-40px] top-[-40px] w-64 h-64 opacity-10 rotate-12" />
                <h2 className="text-4xl font-black mb-2 tracking-tighter">Ofertas Galácticas</h2>
                <p className="opacity-80 text-lg font-medium">Configura descuentos masivos para atraer a más pilotos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(p => (
                <div key={p.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6 group hover:shadow-xl transition-all">
                  <img src={p.images[0]} className="w-20 h-20 rounded-2xl object-cover shadow-md group-hover:scale-110 transition-transform" />
                  <div className="flex-1">
                    <h4 className="font-black text-gray-900 mb-2 leading-tight">{p.title}</h4>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-gray-300 uppercase">Dto:</span>
                       <div className="relative">
                          <input type="number" min="0" max="90" defaultValue={p.discount || 0} onBlur={(e) => updateDiscount(p.id, parseInt(e.target.value) || 0)} className="w-20 px-4 py-2 bg-gray-50 border-2 border-transparent focus:border-[#6A00FF] rounded-xl text-sm font-black text-[#6A00FF] outline-none" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A00FF] font-black text-xs">%</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'home_setup' && (
          <div className="space-y-12">
            <div className="bg-gray-900 p-12 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
                <Layout className="absolute right-[-40px] top-[-40px] w-80 h-80 opacity-5" />
                <div className="relative z-10">
                   <h2 className="text-5xl font-black mb-4 tracking-tighter">Escaparate <span className="text-[#6A00FF]">Principal</span></h2>
                   <p className="opacity-60 text-xl font-medium max-w-2xl">Controla cada palabra y producto que aparece en tu terminal de inicio.</p>
                </div>
            </div>
            <div className="space-y-16">
              {carousels.map((carousel, idx) => (
                <div key={carousel.id} className="bg-white rounded-[40px] border border-gray-100 shadow-2xl overflow-hidden">
                  <div className="bg-gray-50/50 px-10 py-8 border-b border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-5">
                      <div className="bg-gray-900 text-[#6A00FF] w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black">{idx + 1}</div>
                      <div>
                        <h3 className="text-2xl font-black text-gray-900">Carrusel {idx + 1}</h3>
                        <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">{carousel.productIds.length} Items activos</p>
                      </div>
                    </div>
                    <button onClick={() => { setEditingCarousel(carousel); setShowSelectionModal(true); setModalSearch(''); }} className="bg-[#6A00FF] text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-[#5b00db] transition-all"><Plus size={20}/> Seleccionar Productos</button>
                  </div>
                  <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6A00FF] flex items-center gap-2"><Type size={14}/> Título Principal</label>
                          <input type="text" defaultValue={carousel.title} onBlur={(e) => handleCarouselUpdate(carousel.id, { title: e.target.value })} className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-5 text-xl font-black text-gray-900 outline-none focus:border-[#6A00FF] transition-all" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6A00FF] flex items-center gap-2"><Subtitles size={14}/> Subtítulo o Descripción</label>
                          <input type="text" defaultValue={carousel.subtitle} onBlur={(e) => handleCarouselUpdate(carousel.id, { subtitle: e.target.value })} className="w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-5 text-lg font-bold text-gray-500 outline-none focus:border-[#6A00FF] transition-all" />
                       </div>
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Vista Previa de Selección</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                           {products.filter(p => carousel.productIds.includes(p.id)).length > 0 ? products.filter(p => carousel.productIds.includes(p.id)).map(p => (
                               <div key={p.id} className="relative group overflow-hidden rounded-2xl aspect-[3/4] border-2 border-gray-50 shadow-sm">
                                  <img src={p.images[0]} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent flex items-end p-3"><p className="text-white text-[10px] font-black uppercase truncate">{p.title}</p></div>
                               </div>
                             )) : <div className="col-span-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-[32px] bg-gray-50/50"><Layers className="text-gray-200 mb-2" size={32} /><p className="text-gray-300 font-bold text-xs uppercase">Sin productos seleccionados</p></div>}
                        </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* --- ORDER DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
               <div className="p-8 border-b flex justify-between items-center bg-gray-900 text-white">
                  <div>
                     <h2 className="text-2xl font-black">Detalles del Pedido #{selectedOrder.id}</h2>
                     <p className="text-xs font-bold text-[#6A00FF] uppercase tracking-widest">Estado: {selectedOrder.status}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full transition-all"><X size={24}/></button>
               </div>
               <div className="p-8 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                     <h3 className="font-black text-gray-900 flex items-center gap-2"><ShoppingBag size={20}/> Artículos Comprados</h3>
                     <div className="space-y-4">
                        {selectedOrder.items.map(item => (
                          <div key={item.productId} className="flex gap-4 p-4 bg-gray-50 rounded-3xl border border-gray-100">
                             <img src={item.product.images[0]} className="w-16 h-20 object-cover rounded-xl" />
                             <div>
                                <p className="font-black text-gray-900">{item.product.title}</p>
                                <p className="text-xs text-gray-400 font-bold">Precio Unit: ${item.product.priceUsd.toFixed(2)}</p>
                                <p className="text-[#6A00FF] font-black text-sm mt-1">Cantidad: {item.qty}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                     <div className="p-6 bg-[#6A00FF]/5 rounded-3xl border border-[#6A00FF]/10">
                        <div className="flex justify-between items-center mb-2"><span className="text-gray-500 font-bold">Total USD</span><span className="font-black text-gray-900">${selectedOrder.totalUsd.toFixed(2)}</span></div>
                        <div className="flex justify-between items-center"><span className="text-gray-500 font-bold">Total BS</span><span className="font-black text-[#6A00FF]">Bs {selectedOrder.totalBs.toFixed(2)}</span></div>
                     </div>
                  </div>
                  <div className="space-y-8">
                     <h3 className="font-black text-gray-900 flex items-center gap-2"><CreditCard size={20}/> Información de Pago</h3>
                     <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Método</p><p className="font-black text-gray-900 capitalize">{selectedOrder.paymentMethod}</p></div>
                        <div className="p-4 bg-gray-50 rounded-2xl"><p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Referencia</p><p className="font-black text-[#6A00FF]">{selectedOrder.paymentRef || 'N/A'}</p></div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Comprobante (Capture)</p>
                           {selectedOrder.paymentScreenshot ? (
                             <img src={selectedOrder.paymentScreenshot} className="w-full rounded-3xl border-2 border-gray-100 shadow-sm" />
                           ) : <div className="p-10 text-center border-2 border-dashed border-gray-200 rounded-3xl text-gray-300 font-bold uppercase text-[10px]">Sin capture disponible</div>}
                        </div>
                     </div>
                  </div>
               </div>
               <div className="p-8 bg-gray-50 border-t flex justify-end gap-4">
                  <button onClick={() => setSelectedOrder(null)} className="px-8 py-3 rounded-2xl font-black text-gray-500 hover:bg-gray-100 transition-all uppercase text-xs">Cerrar</button>
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleMarkOrderAsRejected(selectedOrder.id)}
                        className="px-8 py-3 bg-red-100 text-red-500 rounded-2xl font-black hover:bg-red-200 transition-all uppercase text-xs"
                      >
                        Rechazar
                      </button>
                      <button 
                        onClick={() => handleMarkOrderAsPaid(selectedOrder.id)}
                        className="px-8 py-3 bg-[#6A00FF] text-white rounded-2xl font-black hover:bg-[#5b00db] transition-all uppercase text-xs shadow-lg shadow-purple-100"
                      >
                        Marcar como Pagado
                      </button>
                    </>
                  )}
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MODALS (SELECTION & ADD PRODUCT) --- */}
      <AnimatePresence>
        {showSelectionModal && editingCarousel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSelectionModal(false)} className="absolute inset-0 bg-gray-900/95 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative bg-white w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col h-[85vh]">
              <div className="p-10 border-b flex justify-between items-center">
                <div><h2 className="text-3xl font-black text-gray-900">Seleccionar Productos</h2><p className="text-gray-400 font-bold uppercase text-xs tracking-widest mt-1">Gestionando: {editingCarousel.title}</p></div>
                <button onClick={() => setShowSelectionModal(false)} className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"><X size={24}/></button>
              </div>
              <div className="px-10 py-6 bg-gray-50/50">
                 <div className="relative">
                    <input type="text" placeholder="Buscar por título..." value={modalSearch} onChange={e => setModalSearch(e.target.value)} className="w-full pl-14 pr-6 py-5 bg-white border-2 border-transparent focus:border-[#6A00FF] rounded-3xl outline-none shadow-sm font-black text-lg transition-all" />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={24} />
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 no-scrollbar">
                 {products.filter(p => p.title.toLowerCase().includes(modalSearch.toLowerCase())).map(p => (
                    <button key={p.id} onClick={() => handleToggleInModal(p.id)} className={`relative flex flex-col p-4 rounded-[32px] border-2 transition-all text-left ${editingCarousel.productIds.includes(p.id) ? 'bg-purple-50 border-[#6A00FF] shadow-lg shadow-purple-100' : 'bg-white border-gray-50 opacity-60'}`}>
                         <div className="relative aspect-square rounded-2xl overflow-hidden mb-4"><img src={p.images[0]} className="w-full h-full object-cover" />{editingCarousel.productIds.includes(p.id) && <div className="absolute top-2 right-2 bg-[#6A00FF] text-white p-2 rounded-xl"><CheckSquare size={16} strokeWidth={3} /></div>}</div>
                         <div className="px-1"><p className={`font-black text-sm truncate ${editingCarousel.productIds.includes(p.id) ? 'text-[#6A00FF]' : 'text-gray-900'}`}>{p.title}</p></div>
                    </button>
                 ))}
              </div>
              <div className="p-8 border-t bg-white flex justify-between items-center"><div className="bg-[#6A00FF] text-white px-4 py-2 rounded-xl font-black text-sm">{editingCarousel.productIds.length} SELECCIONADOS</div><button onClick={() => setShowSelectionModal(false)} className="bg-gray-900 text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-black transition-all">Finalizar Gestión</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- ADD / EDIT PRODUCT MODAL RESTORED --- */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative bg-white w-full max-w-4xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-8 bg-[#6A00FF] text-white flex justify-between items-center">
                 <h2 className="text-2xl font-black flex items-center gap-3">
                    {editingId ? <Edit3 size={28}/> : <Plus size={28}/>} 
                    {editingId ? 'Editar Artículo' : 'Nuevo Artículo'}
                 </h2>
                 <button onClick={closeModal} className="hover:rotate-90 transition-transform"><X size={24}/></button>
              </div>
              <form onSubmit={handleSaveProduct} className="p-10 overflow-y-auto space-y-8 no-scrollbar bg-white">
                
                {/* Section 1: Basic Info */}
                <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Título del Producto</label>
                      <input required type="text" value={newProd.title} onChange={e => setNewProd({...newProd, title: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6A00FF] p-4 rounded-2xl outline-none font-black text-lg text-gray-900 placeholder-gray-300" placeholder="Ej: Cyberpunk 2077" />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">URL de Portada (Imagen)</label>
                       <input type="text" value={newProd.tempImage} onChange={e => setNewProd({...newProd, tempImage: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6A00FF] p-4 rounded-2xl outline-none font-bold text-gray-900 text-sm" placeholder="https://..." />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Descripción</label>
                       <textarea required rows={3} value={newProd.description} onChange={e => setNewProd({...newProd, description: e.target.value})} className="w-full bg-gray-50 border-2 border-transparent focus:border-[#6A00FF] p-4 rounded-2xl outline-none font-medium text-gray-900 resize-none" placeholder="Breve descripción del producto..." />
                    </div>
                </div>

                {/* Section 2: Pricing & Technical */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Precio USD</label>
                           <input required type="number" step="0.01" value={newProd.priceUsd} onChange={e => setNewProd({...newProd, priceUsd: parseFloat(e.target.value)})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-black text-gray-900" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dto %</label>
                           <input type="number" min="0" max="100" value={newProd.discount} onChange={e => setNewProd({...newProd, discount: parseInt(e.target.value)})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-black text-[#6A00FF]" />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Desarrollador / Marca</label>
                         <input type="text" value={newProd.tempDeveloper} onChange={e => setNewProd({...newProd, tempDeveloper: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-gray-900 text-sm" placeholder="Ej: FromSoftware" />
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Año de Lanzamiento</label>
                         <input type="text" value={newProd.tempYear} onChange={e => setNewProd({...newProd, tempYear: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-gray-900 text-sm" placeholder="Ej: 2022" />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoría Principal</label>
                         <select value={newProd.type} onChange={e => setNewProd({...newProd, type: e.target.value as any})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-black text-gray-900 appearance-none cursor-pointer">
                            <option value="game">Videojuego</option>
                            <option value="console">Consola</option>
                            <option value="accessory">Accesorio</option>
                         </select>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Géneros (Separa por comas)</label>
                         <input type="text" value={newProd.tempGenres} onChange={e => setNewProd({...newProd, tempGenres: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-gray-900 text-sm" placeholder="RPG, Acción, Aventura" />
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Modos de Juego (Separa por comas)</label>
                         <input type="text" value={newProd.tempModes} onChange={e => setNewProd({...newProd, tempModes: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-gray-900 text-sm" placeholder="Individual, Online" />
                      </div>
                   </div>
                </div>

                {/* Section 3: Extra Info */}
                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Plataformas (Separa por comas)</label>
                       <input type="text" value={newProd.tempPlatforms} onChange={e => setNewProd({...newProd, tempPlatforms: e.target.value})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-bold text-gray-900 text-sm" placeholder="PS5, Xbox, PC" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Disponible</label>
                       <input type="number" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: parseInt(e.target.value)})} className="w-full bg-gray-50 p-4 rounded-2xl outline-none font-black text-gray-900" />
                    </div>
                </div>

                <div className="pt-6">
                   <button disabled={isSubmitting} type="submit" className="w-full bg-gray-900 text-white py-6 rounded-[24px] font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95">
                     {isSubmitting ? 'GUARDANDO...' : <><Save size={24}/> {editingId ? 'ACTUALIZAR ARTÍCULO' : 'GUARDAR ARTÍCULO'}</>}
                   </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MetricCard = ({ title, val, icon: Icon, color }: any) => (
  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex items-center gap-6 hover:shadow-xl transition-all group">
    <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform ${color}`}><Icon size={32} /></div>
    <div><p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{title}</p><p className="text-3xl font-black text-gray-900">{val}</p></div>
  </div>
);
