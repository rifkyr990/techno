import React from 'react';
import { LayoutDashboard, Users, Calendar, Gift, Settings, Database, LogOut, Bot } from 'lucide-react';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  onSwitchRole: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentRole, 
  onSwitchRole,
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full z-10 flex flex-col shadow-xl">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">T</div>
            <h1 className="text-xl font-bold tracking-tight text-white">TechnoLoyalty</h1>
          </div>
          <p className="text-xs text-slate-400 mt-2">Automation System v1.0</p>
          <div className="mt-2 text-xs bg-slate-800 px-2 py-1 rounded inline-block text-blue-300">
            {currentRole === UserRole.USER ? 'Mitra View' : 'HC Admin View'}
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
                label="AI Strategic Planner" 
                active={activeTab === 'ai-planner'} 
                onClick={() => setActiveTab('ai-planner')}
              />
              <NavItem 
                icon={<Gift size={20} />} 
                label="Reward Redemption" 
                active={activeTab === 'rewards'} 
                onClick={() => setActiveTab('rewards')}
              />
            </>
          ) : (
            <>
              <NavItem 
                icon={<Settings size={20} />} 
                label="System Control" 
                active={activeTab === 'system'} 
                onClick={() => setActiveTab('system')}
              />
              <NavItem 
                icon={<Database size={20} />} 
                label="Data Ingestion" 
                active={activeTab === 'ingestion'} 
                onClick={() => setActiveTab('ingestion')}
              />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900">
          <button
            onClick={onSwitchRole}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Switch to {currentRole === UserRole.USER ? 'Admin' : 'User'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen bg-slate-50">
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
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);
