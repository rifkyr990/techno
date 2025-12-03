import React, { useState, useRef } from 'react';
import { Settings, Upload, Database, Play, AlertTriangle, Check, RefreshCw, FileSpreadsheet, Info, Package, Plus, Minus, Camera } from 'lucide-react';
import { SystemPhase, Reward } from '../types';
import { PHASE_DESCRIPTIONS } from '../constants';

interface AdminViewProps {
  currentPhase: SystemPhase;
  setSystemPhase: (phase: SystemPhase) => void;
  onUploadSprintData: (name: string) => void;
  onRunBatchProcess: () => void;
  isProcessing: boolean;
  rewards: Reward[];
  onUpdateStock: (id: string, newStock: number) => void;
  onUpdateImage: (id: string, newImage: string) => void;
  activeTab: string;
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
  activeTab
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const lowStockItems = rewards.filter(r => r.stock < LOW_STOCK_THRESHOLD);

  if (activeTab === 'inventory') {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Inventory Management</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage stock levels and images for the reward catalog.</p>
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 rounded-xl p-4 flex gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg h-fit text-amber-600 dark:text-amber-500 shrink-0">
                <AlertTriangle size={24} />
             </div>
             <div>
               <h4 className="font-bold text-amber-900 dark:text-amber-200">Low Stock Alert</h4>
               <p className="text-sm text-amber-800 dark:text-amber-300 mt-1">
                 {lowStockItems.length} item{lowStockItems.length !== 1 ? 's' : ''} have fallen below the restocking threshold ({LOW_STOCK_THRESHOLD} units).
               </p>
               <div className="mt-3 flex flex-wrap gap-2">
                 {lowStockItems.map(item => (
                   <div key={item.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-100 border border-amber-200 dark:border-amber-800">
                      <span>{item.name}</span>
                      <span className={`px-1.5 rounded text-[10px] font-bold shadow-sm ${item.stock === 0 ? 'bg-red-500 text-white' : 'bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-100'}`}>
                        {item.stock}
                      </span>
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
                <th className="p-4 font-medium text-sm">Item</th>
                <th className="p-4 font-medium text-sm">Cost (Tokens)</th>
                <th className="p-4 font-medium text-sm">Current Stock</th>
                <th className="p-4 font-medium text-sm text-right">Actions</th>
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
                      {reward.stock} units
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onUpdateStock(reward.id, reward.stock - 1)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-red-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-red-400 transition-colors"
                        title="Decrease Stock"
                      >
                        <Minus size={18} />
                      </button>
                      <button
                        onClick={() => onUpdateStock(reward.id, reward.stock + 1)}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-green-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-green-400 transition-colors"
                        title="Increase Stock"
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data Ingestion</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Upload monthly sprint activity logs (Excel).</p>
        </div>

        <div 
          className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
            dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-800'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Drag & Drop Excel File</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
            Upload the standard "Monthly_Sprint_Log.xlsx". The system will automatically parse User IDs and Tokens.
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
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <FileSpreadsheet size={20} />}
            {isProcessing ? 'Processing Data...' : 'Select File'}
          </button>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-xl p-4 flex gap-3">
          <Info className="text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-200">Ingestion Rules</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 mt-1 list-disc list-inside space-y-1">
              <li>File must contain "EmployeeID" and "SprintCount" columns.</li>
              <li>1 Sprint = 20 Tokens (Hardcoded conversion).</li>
              <li>Uploading triggers "Active" status for the current month.</li>
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
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">System Phase Control</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage the lifecycle of the loyalty program.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.values(SystemPhase).map((phase) => (
          <button
            key={phase}
            onClick={() => setSystemPhase(phase)}
            className={`relative p-6 rounded-xl border-2 text-left transition-all ${
              currentPhase === phase
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-900/10'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`font-bold text-lg ${currentPhase === phase ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                {phase}
              </span>
              {currentPhase === phase && <Check className="text-blue-600 dark:text-blue-400" size={20} />}
            </div>
            <p className={`text-sm ${currentPhase === phase ? 'text-blue-600 dark:text-blue-300' : 'text-slate-500 dark:text-slate-400'}`}>
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
            <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200">Batch Processing Engine</h3>
            <p className="text-amber-800 dark:text-amber-300 mt-1 mb-4">
              Manually trigger the "Judgment Logic" to calculate penalties (Inactive Resets & Downgrades).
              This should be run on <strong>15th June</strong> and <strong>15th December</strong>.
            </p>
            <button
              onClick={onRunBatchProcess}
              disabled={isProcessing}
              className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Play size={18} />}
              {isProcessing ? 'Processing...' : 'Run Judgment Logic'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};