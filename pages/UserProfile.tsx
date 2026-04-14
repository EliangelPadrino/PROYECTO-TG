
/**
 * Archivo: pages/UserProfile.tsx
 * Propósito: Perfil del cliente para editar datos y ver historial de pedidos.
 */
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { mockService } from '../services/mockService';
import { Order } from '../types';
import { useNavigate } from 'react-router-dom';
import { User, Package, Save, Edit3, Mail, Phone, Calendar } from 'lucide-react';
import { Badge } from '../components/Widgets';

export const UserProfile: React.FC = () => {
  const { user, updateUserProfile } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    email: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Initialize form data
    setFormData({
      username: user.username,
      phone: user.phone || '',
      email: user.email
    });

    // Load orders
    mockService.getOrders().then(allOrders => {
      setOrders(allOrders.filter(o => o.userId === user.id));
    });
  }, [user, navigate]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await mockService.updateUser(user.id, formData);
      updateUserProfile(formData);
      setIsEditing(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      alert("Error al actualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <div className="w-full md:w-80 space-y-6">
           <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#6A00FF] to-purple-400 rounded-full mx-auto flex items-center justify-center text-white text-4xl font-black mb-4 shadow-lg shadow-purple-200">
                 {user.firstName[0]}
              </div>
              <h2 className="text-2xl font-black text-gray-900">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-400 font-medium">@{user.username}</p>
              <div className="mt-4"><Badge color="bg-gray-900">Piloto {user.role === 'admin' ? 'Comandante' : 'Cadete'}</Badge></div>
           </div>

           <div className="bg-white p-2 rounded-[24px] border border-gray-100 shadow-sm">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'profile' ? 'bg-[#6A00FF] text-white shadow-lg shadow-purple-200' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <User size={20}/> Mi Perfil
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-black transition-all ${activeTab === 'orders' ? 'bg-[#6A00FF] text-white shadow-lg shadow-purple-200' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                <Package size={20}/> Mis Pedidos
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
           {activeTab === 'profile' && (
             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h2 className="text-3xl font-black text-gray-900">Datos del Perfil</h2>
                   {!isEditing && (
                     <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-[#6A00FF] font-black hover:bg-purple-50 px-4 py-2 rounded-xl transition-all">
                       <Edit3 size={18}/> Editar
                     </button>
                   )}
                </div>

                <form onSubmit={handleUpdate} className="space-y-8 max-w-2xl">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Username</label>
                      <div className="relative">
                         <input 
                           disabled={!isEditing}
                           value={formData.username}
                           onChange={e => setFormData({...formData, username: e.target.value})}
                           className="w-full bg-gray-50 p-4 pl-12 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#6A00FF] disabled:opacity-60 disabled:bg-gray-100"
                         />
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Teléfono</label>
                      <div className="relative">
                         <input 
                           disabled={!isEditing}
                           value={formData.phone}
                           onChange={e => setFormData({...formData, phone: e.target.value})}
                           className="w-full bg-gray-50 p-4 pl-12 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#6A00FF] disabled:opacity-60 disabled:bg-gray-100"
                         />
                         <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Correo Electrónico</label>
                      <div className="relative">
                         <input 
                           disabled={!isEditing}
                           type="email"
                           value={formData.email}
                           onChange={e => setFormData({...formData, email: e.target.value})}
                           className="w-full bg-gray-50 p-4 pl-12 rounded-2xl font-bold text-gray-900 outline-none focus:ring-2 focus:ring-[#6A00FF] disabled:opacity-60 disabled:bg-gray-100"
                         />
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
                      </div>
                   </div>

                   {isEditing && (
                     <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all">Cancelar</button>
                        <button disabled={isSaving} type="submit" className="bg-[#6A00FF] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5b00db] transition-all flex items-center gap-2 shadow-lg shadow-purple-200">
                           {isSaving ? 'Guardando...' : <><Save size={18}/> Guardar Cambios</>}
                        </button>
                     </div>
                   )}
                </form>
             </div>
           )}

           {activeTab === 'orders' && (
             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm min-h-[500px]">
                <h2 className="text-3xl font-black text-gray-900 mb-8">Historial de Pedidos</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                     <Package className="mx-auto text-gray-300 mb-4" size={48}/>
                     <p className="text-gray-400 font-bold uppercase text-xs">Aún no has realizado misiones de compra.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                     {orders.map(order => (
                       <div key={order.id} className="border border-gray-100 rounded-[32px] p-6 hover:shadow-lg transition-all group">
                          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-50">
                             <div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pedido #{order.id}</div>
                                <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
                                   <Calendar size={14}/> {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                             </div>
                             <Badge color={
                               order.status === 'paid' ? 'bg-green-500' : 
                               order.status === 'rejected' ? 'bg-red-500' : 
                               'bg-orange-400'
                             }>
                               {order.status === 'rejected' ? 'Rechazado' : order.status}
                             </Badge>
                          </div>
                          
                          <div className="space-y-4">
                             {order.items.map(item => (
                               <div key={item.productId} className="flex items-center gap-4">
                                  <img src={item.product.images[0]} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                                  <div>
                                     <p className="font-black text-gray-900 text-sm">{item.product.title}</p>
                                     <p className="text-xs text-[#6A00FF] font-bold">x{item.qty}</p>
                                  </div>
                               </div>
                             ))}
                          </div>

                          <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                             <span className="text-xs font-bold text-gray-400 uppercase">Total Compra</span>
                             <span className="text-xl font-black text-gray-900">${order.totalUsd.toFixed(2)}</span>
                          </div>
                       </div>
                     ))}
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
