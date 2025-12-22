import React, { useState } from 'react';
import { Shield, Clock, Coins, Lock, CheckCircle, AlertCircle, TrendingUp, X, History, ChevronRight, Calendar, ShoppingBag, Loader2 } from 'lucide-react';
import { User, Reward, SystemPhase, PickupSlot, Grade } from '../types';
import { AiPlanner } from './AiPlanner';

interface UserViewProps {
  user: User;
  activeTab: string;
  systemPhase: SystemPhase;
  rewards: Reward[];
  slots: PickupSlot[];
  onRedeem: (reward: Reward) => void;
  onBookSlot: (slotId: string) => void;
}

export const UserView: React.FC<UserViewProps> = ({ 
  user, 
  activeTab, 
  systemPhase, 
  rewards, 
  slots, 
  onRedeem, 
  onBookSlot 
}) => {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Helper to determine if redemption is allowed
  const canRedeem = systemPhase === SystemPhase.REDEEM;

  const handleConfirmRedemption = () => {
    if (selectedReward && selectedSlot) {
      setIsRedeeming(true);
      setTimeout(() => {
        onRedeem(selectedReward);
        onBookSlot(selectedSlot);
        setIsRedeeming(false);
        setSelectedReward(null);
        setSelectedSlot(null);
      }, 1500);
    }
  };

  const getGradeColor = (grade: Grade) => {
    switch (grade) {
      case Grade.SAPPHIRE: return 'text-blue-500 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case Grade.RUBY: return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case Grade.DIAMOND: return 'text-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-800';
      default: return 'text-slate-500 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  if (activeTab === 'ai-planner') {
    return <AiPlanner user={user} rewards={rewards} />;
  }

  if (activeTab === 'rewards') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Penukaran Hadiah</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tukarkan token Anda dengan hadiah eksklusif.</p>
        </div>

        {!canRedeem && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-3">
            <Lock className="text-amber-600 dark:text-amber-500 shrink-0" />
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-200">Penukaran Terkunci</h4>
              <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                Periode penukaran saat ini ditutup. Anda dapat melihat katalog, tetapi penukaran hanya akan dibuka selama fase <strong>Hari Penukaran (Redeem)</strong>.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
              <div className="h-48 bg-slate-100 dark:bg-slate-700 relative">
                <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm dark:text-white">
                  Sisa {reward.stock}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{reward.name}</h3>
                <div className="flex items-center gap-1.5 text-brand font-bold text-lg mb-4">
                  <Coins size={20} className="fill-current opacity-20" />
                  {reward.cost} Token
                </div>
                
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => setSelectedReward(reward)}
                    disabled={!canRedeem || user.tokens < reward.cost || reward.stock === 0}
                    className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                      !canRedeem || user.tokens < reward.cost || reward.stock === 0
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'bg-brand hover:bg-brand-dark text-white shadow-lg shadow-brand/20'
                    }`}
                  >
                    {reward.stock === 0 ? (
                      'Stok Habis'
                    ) : user.tokens < reward.cost ? (
                      <>Token Kurang</>
                    ) : !canRedeem ? (
                      <><Lock size={16} /> Terkunci</>
                    ) : (
                      'Tukar Sekarang'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Redemption Modal */}
        {selectedReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Konfirmasi Penukaran</h3>
                <button onClick={() => setSelectedReward(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto">
                <div className="flex gap-4 mb-6">
                  <img src={selectedReward.image} alt="" className="w-20 h-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-700" />
                  <div>
                    <h4 className="font-bold text-lg text-slate-900 dark:text-white">{selectedReward.name}</h4>
                    <p className="text-brand font-bold">{selectedReward.cost} Token</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Saldo setelahnya: {user.tokens - selectedReward.cost}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar size={18} /> Pilih Slot Pengambilan
                  </h4>
                  <div className="grid gap-3">
                    {slots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.id)}
                        disabled={slot.booked >= slot.quota}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedSlot === slot.id
                            ? 'border-brand bg-brand/5 ring-1 ring-brand'
                            : slot.booked >= slot.quota
                            ? 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 opacity-60 cursor-not-allowed'
                            : 'border-slate-200 dark:border-slate-700 hover:border-brand/30 dark:hover:border-brand/30 bg-white dark:bg-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className={`font-semibold ${selectedSlot === slot.id ? 'text-brand-dark dark:text-brand' : 'text-slate-700 dark:text-slate-300'}`}>
                            {new Date(slot.datetime).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                          </span>
                          <span className="text-xs font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-600 dark:text-slate-300">
                            {new Date(slot.datetime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex justify-between items-end text-xs mt-2">
                           <span className="text-slate-500 dark:text-slate-400">Kuota: {slot.quota}</span>
                           <span className={slot.booked >= slot.quota ? 'text-red-500' : 'text-green-600 dark:text-green-400'}>
                             {slot.booked >= slot.quota ? 'Penuh' : `${slot.quota - slot.booked} tempat tersisa`}
                           </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <button
                  onClick={handleConfirmRedemption}
                  disabled={!selectedSlot || isRedeeming}
                  className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-brand/20 disabled:opacity-70 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {isRedeeming ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Memproses...
                    </>
                  ) : (
                    <>Konfirmasi Penukaran</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Selamat datang kembali, {user.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Token Balance Card */}
        <div className="bg-gradient-to-br from-brand to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-brand/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-brand-light mb-1">
              <Coins size={18} />
              <span className="font-medium text-sm">Saldo Token</span>
            </div>
            <div className="text-4xl font-bold mb-4">{user.tokens}</div>
            <div className="text-xs bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
              Siklus Saat Ini Aktif
            </div>
          </div>
        </div>

        {/* Grade Status Card */}
        <div className={`rounded-2xl p-6 border-2 relative overflow-hidden ${getGradeColor(user.grade)}`}>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1 opacity-80">
              <Shield size={18} />
              <span className="font-medium text-sm">Peringkat Saat Ini</span>
            </div>
            <div className="text-4xl font-bold mb-4">{user.grade}</div>
            <div className="text-xs inline-block px-3 py-1 rounded-full bg-white/50 dark:bg-black/20 backdrop-blur-sm font-medium">
              Top 20% karyawan
            </div>
          </div>
        </div>

        {/* Expiry Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1">
            <Clock size={18} />
            <span className="font-medium text-sm">Masa Berlaku Token</span>
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            {new Date(user.tokenExpiryDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg mt-3">
            <AlertCircle size={14} />
            <span>Token hangus setelah 3 tahun</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Transaction History */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <History size={20} className="text-brand" />
              Aktivitas Terbaru
            </h3>
            <button 
              onClick={() => setShowHistoryModal(true)}
              className="text-sm text-brand hover:text-brand-dark font-medium flex items-center gap-1"
            >
              Lihat Semua <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {user.history.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    log.type === 'EARN' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : log.type === 'SPEND'
                      ? 'bg-brand/10 text-brand'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  }`}>
                    {log.type === 'EARN' ? <TrendingUp size={18} /> : log.type === 'SPEND' ? <ShoppingBag size={18} /> : <AlertCircle size={18} />}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{log.description}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(log.date).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
                <div className={`font-bold ${
                  log.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-slate-100'
                }`}>
                  {log.change > 0 ? '+' : ''}{log.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats / Info */}
        <div className="bg-brand/5 dark:bg-brand/10 rounded-2xl p-6 border border-brand/10 dark:border-brand/20">
          <h3 className="font-bold text-lg text-brand-dark dark:text-brand mb-4">Status Program</h3>
          <div className="space-y-4">
            <div className="bg-white dark:bg-brand/20 p-4 rounded-xl border border-brand/10">
              <p className="text-xs text-brand uppercase font-semibold mb-1">Fase Saat Ini</p>
              <p className="font-bold text-brand-dark dark:text-brand-light">{systemPhase}</p>
            </div>
            
            <div className="bg-white dark:bg-brand/20 p-4 rounded-xl border border-brand/10">
              <p className="text-xs text-brand uppercase font-semibold mb-1">Pelacak Inaktivitas</p>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-brand-dark dark:text-brand/80">Berturut-turut Absen</span>
                <span className={`font-bold ${user.inactiveMonthsConsecutive >= 2 ? 'text-red-600' : 'text-brand-dark dark:text-brand-light'}`}>
                  {user.inactiveMonthsConsecutive}/3
                </span>
              </div>
              <div className="w-full bg-brand/10 dark:bg-brand/30 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${user.inactiveMonthsConsecutive >= 2 ? 'bg-red-500' : 'bg-brand'}`} 
                  style={{ width: `${(user.inactiveMonthsConsecutive / 3) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full h-[80vh] flex flex-col">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <History className="text-brand" />
                Riwayat Transaksi
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {user.history.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      log.type === 'EARN' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                        : log.type === 'SPEND'
                        ? 'bg-brand/10 text-brand'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    }`}>
                      {log.type === 'EARN' ? <TrendingUp size={18} /> : log.type === 'SPEND' ? <ShoppingBag size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white text-sm">{log.description}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(log.date).toLocaleDateString('id-ID', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    log.change > 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-slate-100'
                  }`}>
                    {log.change > 0 ? '+' : ''}{log.change}
                  </div>
                </div>
              ))}
              
              {user.history.length === 0 && (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                  Tidak ada riwayat transaksi ditemukan.
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex justify-end rounded-b-2xl">
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="px-6 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};