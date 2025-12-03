import React, { useState, useRef } from 'react';
import { Settings, Upload, Database, Play, AlertTriangle, Check, RefreshCw, FileSpreadsheet, Info } from 'lucide-react';
import { SystemPhase } from '../types';
import { PHASE_DESCRIPTIONS } from '../constants';

interface AdminViewProps {
  currentPhase: SystemPhase;
  setSystemPhase: (phase: SystemPhase) => void;
  onUploadSprintData: (sprintName: string) => void;
  onRunBatchProcess: () => void;
  isProcessing: boolean;
}

export const AdminView: React.FC<AdminViewProps> = ({ 
  currentPhase, 
  setSystemPhase, 
  onUploadSprintData,
  onRunBatchProcess,
  isProcessing
}) => {
  const [sprintFile, setSprintFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const phases = Object.values(SystemPhase);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSprintFile(e.target.files[0]);
    }
  };

  const handleUploadClick = () => {
    if (sprintFile) {
      // Simulate reading the filename to determine sprint month or just pass a generic name
      onUploadSprintData(sprintFile.name.replace('.xlsx', ''));
      setSprintFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">System Administration</h2>
          <p className="text-slate-500 mt-1">Manage system phases, data ingestion, and batch processing.</p>
        </div>
      </div>

      {/* Phase Management */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
            <Settings size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">System Phase Control</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {phases.map((phase) => (
            <button
              key={phase}
              onClick={() => setSystemPhase(phase)}
              className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                currentPhase === phase
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`font-bold ${currentPhase === phase ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {phase}
                </span>
                {currentPhase === phase && <Check size={18} className="text-indigo-600" />}
              </div>
              <p className="text-xs text-slate-500 pr-4">{PHASE_DESCRIPTIONS[phase]}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Data Ingestion */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Data Ingestion</h3>
              <p className="text-xs text-slate-500">Upload monthly sprint Excel</p>
            </div>
          </div>

          <div className="flex-1 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 flex flex-col items-center justify-center p-8 text-center hover:bg-slate-100 transition-colors">
            <FileSpreadsheet size={48} className="text-slate-300 mb-4" />
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            {sprintFile ? (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-900">{sprintFile.name}</p>
                <p className="text-xs text-slate-500">{(sprintFile.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="mb-4">
                <p className="text-sm font-medium text-slate-900">Drop Excel file here or</p>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:underline text-sm font-bold"
                >
                  Browse Computer
                </button>
              </div>
            )}
            <button 
              onClick={handleUploadClick}
              disabled={!sprintFile || isProcessing}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors w-full flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={18} /> : <Upload size={18} />}
              Upload & Process
            </button>
          </div>
          
          <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800 flex gap-2">
            <Info size={14} className="shrink-0 mt-0.5" />
            Logic: 1 Sprint = 20 Tokens. Matching based on Email/Employee ID.
          </div>
        </section>

        {/* Batch Processing Engine */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <RefreshCw size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Batch Processing Engine</h3>
              <p className="text-xs text-slate-500">End of Semester Logic</p>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <h4 className="font-bold text-sm text-slate-900 mb-2">Processing Rules:</h4>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex gap-2">
                  <span className="font-mono bg-red-100 text-red-700 px-1 rounded">RESET</span> 
                  If inactive 3 months consecutive → Tokens = 0.
                </li>
                <li className="flex gap-2">
                  <span className="font-mono bg-orange-100 text-orange-700 px-1 rounded">DOWNGRADE</span>
                  If inactive 3 months cumulative → Grade -1, Tokens -50%.
                </li>
                <li className="flex gap-2">
                  <span className="font-mono bg-blue-100 text-blue-700 px-1 rounded">EXPIRY</span>
                  Remove tokens older than 3 years.
                </li>
              </ul>
            </div>

            <button 
              onClick={onRunBatchProcess}
              disabled={isProcessing}
              className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
            >
              {isProcessing ? <RefreshCw className="animate-spin" /> : <Play size={20} />}
              Execute "Judgment Day" Logic
            </button>
            
            {currentPhase !== SystemPhase.JUDGMENT && (
              <p className="text-xs text-center text-red-500 font-medium">
                Warning: System is not in "Judgment Day" phase. Results may impact active users.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};