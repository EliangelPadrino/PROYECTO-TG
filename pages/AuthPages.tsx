
/**
 * Archivo: pages/AuthPages.tsx
 * Propósito: Formularios de autenticación
 * Autor: Eliángel
 */
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { mockService } from '../services/mockService';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@ctrlfreak.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await mockService.login(email, password);
      login(user);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 relative">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-[#6A00FF] font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Volver al inicio
      </button>

      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tighter text-gray-900 mb-2">
              CTRL<span className="text-[#6A00FF]">-FREAK</span>
          </h1>
          <p className="text-gray-500">Ingresa a tu cuenta para continuar</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6A00FF] focus:border-transparent outline-none text-black"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#6A00FF] focus:border-transparent outline-none text-black"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#6A00FF] text-white py-3 rounded-lg font-bold hover:bg-[#5b00db] transition-colors shadow-lg shadow-purple-200"
          >
            Ingresar
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta? <Link to="/register" className="text-[#6A00FF] font-semibold cursor-pointer hover:underline">Regístrate</Link>
        </div>
        <div className="mt-4 text-center text-xs text-gray-400">
           Demo: admin@ctrlfreak.com / 123456
        </div>
      </div>
    </div>
  );
};

export const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const { login } = useStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    
    try {
      const user = await mockService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        phone: formData.phone,
        email: formData.email,
        password: formData.password
      } as any);
      login(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10 relative">
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 hover:text-[#6A00FF] font-medium transition-colors"
      >
        <ArrowLeft size={20} /> Volver al inicio
      </button>

      <div className="max-w-xl w-full bg-white p-8 rounded-[32px] shadow-xl border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900 mb-2">
              Únete a <span className="text-[#6A00FF]">CTRL-FREAK</span>
          </h1>
          <p className="text-gray-500">Crea tu identidad de piloto</p>
        </div>

        {error && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 font-bold text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Nombre</label>
                <input required name="firstName" onChange={handleChange} className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/20 outline-none font-bold text-black" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Apellido</label>
                <input required name="lastName" onChange={handleChange} className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/20 outline-none font-bold text-black" />
              </div>
           </div>

           <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Username</label>
              <input required name="username" onChange={handleChange} placeholder="Inventa un nombre divertido ¡Sé creativoo!" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/20 outline-none font-bold placeholder-gray-400 text-sm text-black" />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Teléfono</label>
                <input required name="phone" type="tel" onChange={handleChange} className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/20 outline-none font-bold text-black" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</label>
                <input required name="email" type="email" onChange={handleChange} className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/20 outline-none font-bold text-black" />
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Contraseña</label>
                <input required name="password" type="password" onChange={handleChange} className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/20 outline-none font-bold text-black" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Confirmar</label>
                <input required name="confirmPassword" type="password" onChange={handleChange} className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:border-[#6A00FF] focus:ring-2 focus:ring-[#6A00FF]/20 outline-none font-bold text-black" />
              </div>
           </div>

          <button 
            type="submit"
            className="w-full bg-[#6A00FF] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#5b00db] transition-all shadow-xl shadow-purple-200 mt-4"
          >
            Registrarse
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta? <Link to="/login" className="text-[#6A00FF] font-black cursor-pointer hover:underline">Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
}
