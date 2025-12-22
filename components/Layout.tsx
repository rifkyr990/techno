import React from 'react';
import { LayoutDashboard, Users, Calendar, Gift, Settings, Database, LogOut, Bot, Moon, Sun, Package } from 'lucide-react';
import { UserRole, User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentRole: UserRole;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user,
  currentRole, 
  onLogout,
  activeTab,
  setActiveTab,
  isDarkMode,
  toggleDarkMode
}) => {
  // Menggunakan sprite Bluk Berry yang berwarna ungu (mirip anggur) sesuai permintaan
  const LOGO_URL = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/bluk-berry.png";

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 text-slate-900 dark:text-white fixed h-full z-10 flex flex-col shadow-xl border-r border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="TechBerry Logo Anggur" className="w-10 h-10 object-contain shrink-0" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">TechBerry</h1>
              <span className="mt-1 text-[10px] font-bold text-brand uppercase tracking-wider">
                {currentRole === UserRole.USER ? 'Tampilan Mitra' : 'Tampilan Admin HC'}
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
          {currentRole === UserRole.USER ? (
            <>
              <NavItem 
                icon={<LayoutDashboard size={20} />} 
                label="Dashboard" 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')}
              />
              <NavItem 
                icon={<Bot size={20} />} 
                label="Ask Berry" 
                active={activeTab === 'ai-planner'} 
                onClick={() => setActiveTab('ai-planner')}
              />
              <NavItem 
                icon={<Gift size={20} />} 
                label="Penukaran Hadiah" 
                active={activeTab === 'rewards'} 
                onClick={() => setActiveTab('rewards')}
              />
            </>
          ) : (
            <>
              <NavItem 
                icon={<Settings size={20} />} 
                label="Kontrol Sistem" 
                active={activeTab === 'system'} 
                onClick={() => setActiveTab('system')}
              />
              <NavItem 
                icon={<Database size={20} />} 
                label="Input Data" 
                active={activeTab === 'ingestion'} 
                onClick={() => setActiveTab('ingestion')}
              />
              <NavItem 
                icon={<Package size={20} />} 
                label="Inventaris" 
                active={activeTab === 'inventory'} 
                onClick={() => setActiveTab('inventory')}
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <button
            onClick={toggleDarkMode}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors text-sm font-medium"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            <span>{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
          </button>
          
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-brand/10 dark:bg-brand/20 text-brand flex items-center justify-center font-bold shrink-0 border border-brand/20">
                {user.name.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold truncate text-slate-900 dark:text-white">{user.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold tracking-wider">
                  {currentRole === UserRole.USER ? 'Mitra' : 'Admin HC'}
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Keluar"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200 text-slate-900 dark:text-slate-100">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-brand text-white shadow-lg shadow-brand/20' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);