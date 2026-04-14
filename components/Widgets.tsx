
/**
 * Archivo: components/Widgets.tsx
 * Propósito: Widget de Chat (Gemini API) y componentes UI pequeños
 * Autor: Eliángel
 */
import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Always use import {GoogleGenAI} from "@google/genai";
import { GoogleGenAI } from "@google/genai";

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{from: 'bot'|'user', text: string}[]>([
    { from: 'bot', text: '¡Hola! Soy el asistente de Ctrl-Freak. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fix: Integrated real Gemini API into ChatWidget.
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      // Initialize client before call. API key is from process.env.API_KEY.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: 'Eres el asistente virtual oficial de Ctrl-Freak, una tienda especializada en gaming. Tu tono debe ser amable, moderno y muy servicial. Conoces el catálogo: Cyberpunk 2077, Elden Ring, y consolas PS5.',
        },
      });

      // Correctly access response.text property (not method).
      const botMsg = response.text || 'Lo siento, tuve un problema al procesar tu mensaje.';
      setMessages(prev => [...prev, { from: 'bot', text: botMsg }]);
    } catch (error) {
      console.error("Gemini Assistant Error:", error);
      setMessages(prev => [...prev, { from: 'bot', text: 'Estamos experimentando fallas en la red. Intenta de nuevo más tarde.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-[#6A00FF] rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="text-white w-7 h-7" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden h-[500px]"
          >
            <div className="bg-[#6A00FF] p-4 flex justify-between items-center text-white">
              <span className="font-bold flex items-center gap-2"><MessageCircle size={18}/> Asistente Ctrl-Freak</span>
              <button onClick={() => setIsOpen(false)}><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.from === 'user' ? 'bg-[#6A00FF] text-white rounded-tr-none' : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 text-gray-400 p-3 rounded-lg text-xs italic rounded-tl-none animate-pulse">
                    Procesando...
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t bg-white flex gap-2">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                type="text" 
                placeholder="Escribe tu duda..." 
                disabled={isLoading}
                className="flex-1 text-sm outline-none bg-gray-100 rounded-full px-4 py-2 focus:ring-1 focus:ring-[#6A00FF] disabled:opacity-50"
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className="bg-[#6A00FF] text-white p-2 rounded-full hover:bg-purple-700 disabled:bg-gray-300 transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = 'bg-[#6A00FF]' }) => (
  <span className={`${color} text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm`}>
    {children}
  </span>
);
