
import React, { useState, useRef } from 'react';
import { Settings, Upload, Database, Play, AlertTriangle, Check, RefreshCw, FileSpreadsheet, Info, Package, Plus, Minus, Camera, FileUp, Truck } from 'lucide-react';
import { SystemPhase, Reward } from '../types';
import { PHASE_DESCRIPTIONS } from '../constants';
import { ToastType } from './Toast';

interface AdminViewProps {
  currentPhase: SystemPhase;
  setSystemPhase: (phase: SystemPhase) => void;
  onUploadSprintData: (name: string) => void;
  onRunBatchProcess: () => void;
  isProcessing: boolean;
  rewards: Reward[];
  onUpdateStock: (id: string, newStock: number) => void;
  onUpdateImage: (id: string, newImage: string) => void;
  onBulkAddRewards: (rewards: Omit<Reward, 'id'>[]) => void;
  activeTab: string;
  onShowToast: (message: string, type: ToastType) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentPhase,
  setSystemPhase,
  onUploadSprintData,
  onRunBatchProcess,
  isProcessing,
  rewards,
  onUpdateStock,
  onUpdateImage,
  onBulkAddRewards,
  activeTab,
  onShowToast
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const LOW_STOCK_THRESHOLD = 3;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUploadSprintData(e.dataTransfer.files[0].name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadSprintData(e.target.files[0].name);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, rewardId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateImage(rewardId, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCsvImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (!text) return;

        try {
          const lines = text.split('\n');
          const newRewards: Omit<Reward, 'id'>[] = [];
          
          // Simple heuristic: skip first line if it looks like a header (contains "Name" or "Cost")
          const startIdx = lines[0].toLowerCase().includes('name') || lines[0].toLowerCase().includes('cost') ? 1 : 0;

          for (let i = startIdx; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Assuming simplified CSV: Name, Cost, Stock, ImageURL (optional)
            // Does not handle commas inside quotes for this simple version
            const parts = line.split(',');
            
            if (parts.length >= 3) {
              const name = parts[0].trim();
              const cost = parseInt(parts[1].trim());
              const stock = parseInt(parts[2].trim());
              const image = parts[3]?.trim() || 'https://via.placeholder.com/300';

              if (name && !isNaN(cost) && !isNaN(stock)) {
                newRewards.push({ name, cost, stock, image });
              }
            }
          }

          if (newRewards.length > 0) {
            onBulkAddRewards(newRewards);
            // Reset input
            if (csvInputRef.current) csvInputRef.current.value = '';
          } else {
            onShowToast('Tidak ada data hadiah valid ditemukan dalam CSV. Format: Name, Cost, Stock, ImageURL', 'error');
          }
        } catch (error) {
          console.error("CSV Parse Error", error);
          onShowToast('Gagal memproses file CSV.', 'error');
        }
      };
      
      reader.readAsText(file);
    }
  };

  const handleRestockRequest = (itemName: string) => {
    // In a real application, this would send an API request to the backend/procurement system
    onShowToast(`Notifikasi Pengadaan: Alur kerja Restock dimulai untuk "${itemName}".`, 'success');
  };

  const lowStockItems = rewards.filter(r => r.stock < LOW_STOCK_THRESHOLD);

  if (activeTab === 'inventory') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Manajemen Inventaris</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola stok dan gambar katalog hadiah.</p>
          </div>
          <div>
            <input 
              ref={csvInputRef}
              type="file" 
              accept=".csv" 
              className="hidden" 
              onChange={handleCsvImport}
            />
            <button
              onClick={() => csvInputRef.current?.click()}
              className="flex items-center gap-2 bg-brand hover:bg-brand-dark text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            >
              <FileUp size={16} />
              Impor CSV
            </button>
            <p className="text-[10px] text-slate-400 text-right mt-1">Format: Name, Cost, Stock, ImageURL</p>
          </div>
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg h-fit text-amber-600 dark:text-amber-500 shrink-0">
                <AlertTriangle size={24} />
             </div>
             <div>
               <h4 className="font-bold text-amber-900 dark:text-amber-200">Peringatan Stok Rendah</h4>
               <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                 {lowStockItems.length} barang telah jatuh di bawah ambang batas stok ({LOW_STOCK_THRESHOLD} unit).
               </p>
               <div className="mt-3 flex flex-wrap gap-3">
                 {lowStockItems.map(item => (
                   <div key={item.id} className="inline-flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium bg-amber-100/50 text-amber-900 dark:bg-amber-900/30 dark:text-amber-100 border border-amber-200 dark:border-amber-800">
                      <div className="flex items-center gap-2">
                          <span>{item.name}</span>
                          <span className={`px-1.5 rounded text-[10px] font-bold shadow-sm ${item.stock === 0 ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-100'}`}>
                            {item.stock}
                          </span>
                      </div>
                      <button 
                        onClick={() => handleRestockRequest(item.name)}
                        className="flex items-center gap-1 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 px-2 py-1 rounded transition-colors shadow-sm"
                      >
                        <Truck size={12} />
                        Restock Sekarang
                      </button>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4 font-medium text-sm">Barang</th>
                <th className="p-4 font-medium text-sm">Biaya (Token)</th>
                <th className="p-4 font-medium text-sm">Stok Saat Ini</th>
                <th className="p-4 font-medium text-sm text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {rewards.map((reward) => (
                <tr key={reward.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative group w-12 h-12 shrink-0">
                        <img 
                          src={reward.image} 
                          alt="" 
                          className="w-full h-full rounded-lg object-cover bg-slate-100 dark:bg-slate-700" 
                        />
                        <label className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                          <Camera size={16} className="text-white" />
                          <input 
                            type="file" 
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, reward.id)}
                          />
                        </label>
                      </div>
                      <span className="font-medium text-slate-900 dark:text-white">{reward.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{reward.cost}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reward.stock === 0 
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                        : reward.stock < LOW_STOCK_THRESHOLD 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {reward.stock} unit
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onUpdateStock(reward.id, reward.stock - 1)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400 transition-colors"
                        title="Kurangi Stok"
                      >
                        <Minus size={18} />
                      </button>
                      <button
                        onClick={() => onUpdateStock(reward.id, reward.stock + 1)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-green-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-green-400 transition-colors"
                        title="Tambah Stok"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (activeTab === 'ingestion') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Input Data</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Upload log aktivitas sprint bulanan (Excel).</p>
        </div>

        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-brand bg-brand/10' 
              : 'border-slate-300 dark:border-slate-700 hover:border-brand/50 dark:hover:border-brand/50 bg-white dark:bg-slate-800'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 bg-brand/10 text-brand rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tarik & Lepas File Excel</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Upload "Monthly_Sprint_Log.xlsx". Sistem akan secara otomatis mengurai ID Karyawan dan Token.
          </p>
          <input 
            ref={fileInputRef}
            type="file" 
            accept=".xlsx,.xls,.csv" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <FileSpreadsheet size={20} />}
            {isProcessing ? 'Memproses Data...' : 'Pilih File'}
          </button>
        </div>

        <div className="bg-brand/5 dark:bg-brand/10 border border-brand/20 rounded-xl p-4 flex gap-3">
          <Info className="text-brand shrink-0" />
          <div>
            <h4 className="font-bold text-brand-dark dark:text-brand">Aturan Input</h4>
            <ul className="text-sm text-brand-dark/80 dark:text-brand/80 mt-1 list-disc list-inside space-y-1">
              <li>File wajib berisi kolom "EmployeeID" dan "SprintCount".</li>
              <li>1 Sprint = 20 Token (Konversi tetap).</li>
              <li>Upload memicu status "Aktif" untuk bulan berjalan.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Default: System Control
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Kontrol Fase Sistem</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Kelola siklus hidup program loyalitas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(SystemPhase).map((phase) => (
          <button
            key={phase}
            onClick={() => setSystemPhase(phase)}
            className={`relative p-6 rounded-xl border-2 text-left transition-all ${
              currentPhase === phase
                ? 'border-brand bg-brand/10 shadow-lg shadow-brand/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`font-bold text-lg ${currentPhase === phase ? 'text-brand-dark dark:text-brand' : 'text-slate-700 dark:text-slate-300'}`}>
                {phase}
              </span>
              {currentPhase === phase && <Check className="text-brand" size={20} />}
            </div>
            <p className={`text-sm ${currentPhase === phase ? 'text-brand-dark dark:text-brand/80' : 'text-slate-500 dark:text-slate-400'}`}>
              {PHASE_DESCRIPTIONS[phase]}
            </p>
          </button>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-lg text-amber-600 dark:text-amber-500">
            <Settings size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">Mesin Pemrosesan Batch</h3>
            <p className="text-amber-800 dark:text-amber-300 mt-1 mb-4">
              Memicu "Logika Penghakiman" secara manual untuk menghitung penalti (Reset Inaktivitas & Penurunan Peringkat).
              Ini harus dijalankan pada <strong>15 Juni</strong> dan <strong>15 Desember</strong>.
            </p>
            <button
              onClick={onRunBatchProcess}
              disabled={isProcessing}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
              {isProcessing ? 'Memproses...' : 'Jalankan Logika Penghakiman'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
