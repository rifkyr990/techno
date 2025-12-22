import React, { useState } from 'react';
import { UserRole } from '../types';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string, role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  // Menggunakan sprite Bluk Berry yang berwarna ungu (mirip anggur)
  const LOGO_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/bluk-berry.png";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onLogin(email, role);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <img src={LOGO_URL} alt="TechBerry Logo Anggur" className="w-20 h-20 mx-auto mb-4 object-contain animate-bounce" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Selamat Datang</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Masuk ke TechBerry</p>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setRole(UserRole.USER)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                role === UserRole.USER 
                  ? 'bg-white dark:bg-slate-700 text-brand dark:text-brand shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Mitra (User)
            </button>
            <button
              type="button"
              onClick={() => setRole(UserRole.ADMIN)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                role === UserRole.ADMIN 
                  ? 'bg-white dark:bg-slate-700 text-brand dark:text-brand shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              HC (Admin)
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Alamat Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder={role === UserRole.ADMIN ? "admin@techno.co.id" : "budi.santoso@techno.co.id"}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all text-slate-900 placeholder:text-slate-400"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand/20"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <span className="flex items-center gap-2">Masuk <ArrowRight size={18} /></span>}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
             <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">Akun Demo</p>
             <div className="flex flex-col gap-1 text-xs text-slate-400 dark:text-slate-500">
               <code>User: budi.santoso@techno.co.id</code>
               <code>Admin: admin@techno.co.id</code>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};