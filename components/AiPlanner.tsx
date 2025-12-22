import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { User as UserType, Reward, ChatMessage } from '../types';
import { getStrategicAdvice } from '../services/geminiService';

interface AiPlannerProps {
  user: UserType;
  rewards: Reward[];
}

export const AiPlanner: React.FC<AiPlannerProps> = ({ user, rewards }) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Halo ${user.name}! Saya adalah Berry, asisten loyalitas Anda. Beri tahu saya hadiah mana yang Anda targetkan (misalnya, "Saya ingin Headphone Sony"), dan saya akan menghitung strategi sprint yang paling efisien untuk Anda.`,
      timestamp: Date.now()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await getStrategicAdvice(user, rewards, input);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: aiResponseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 h-[calc(100vh-8rem)] flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 bg-brand/10 dark:bg-brand/20 rounded-full flex items-center justify-center text-brand">
          <Bot size={24} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Ask Berry</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Strategi Loyalitas AI</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-200' : 'bg-brand text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${
              msg.role === 'user' 
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tr-none' 
                : 'bg-brand/5 dark:bg-brand/10 text-slate-900 dark:text-slate-100 border border-brand/10 rounded-tl-none'
            }`}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              <span className="text-[10px] opacity-50 mt-2 block">
                {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
             <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-brand/5 dark:bg-brand/10 rounded-2xl rounded-tl-none px-6 py-4 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-brand" />
              <span className="text-sm text-brand font-medium">Berry sedang berpikir...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-2xl">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan Berry tentang strategi hadiah Anda..."
            className="w-full pl-6 pr-14 py-4 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-white rounded-xl focus:ring-2 focus:ring-brand focus:outline-none transition-all placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-2 p-2 bg-brand text-white rounded-lg hover:bg-brand-dark disabled:opacity-50 disabled:hover:bg-brand transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};