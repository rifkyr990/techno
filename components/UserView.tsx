import React, { useState } from 'react';
import { Shield, Clock, Coins, ShoppingBag, Calendar, Lock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { User, Reward, SystemPhase, PickupSlot } from '../types';
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

  const canRedeem = systemPhase === SystemPhase.REDEEM;

  if (activeTab === 'ai-planner') {
    return <AiPlanner user={user} rewards={rewards} />;
  }

  if (activeTab === 'rewards') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Reward Catalog</h2>
            <p className="text-slate-500 mt-1">Exchange your hard-earned tokens for exclusive gear.</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500 mb-1">Your Balance</p>
            <div className="text-2xl font-bold text-blue-600 flex items-center gap-2 justify-end">
              <Coins className="text-yellow-500" /> {user.tokens}
            </div>
          </div>
        </div>

        {!canRedeem && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Lock className="text-amber-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-bold text-amber-900">Redemption Locked</h4>
              <p className="text-sm text-amber-800 mt-1">
                Rewards can only be redeemed during the <strong>Redeem Day</strong> phase (20th-21st of June/Dec).
                Current Phase: <span className="font-mono bg-amber-200 px-1 rounded text-xs">{systemPhase}</span>
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img src={reward.image} alt={reward.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-md">
                  {reward.stock} left
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900">{reward.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-2xl font-bold text-blue-600 flex items-center gap-1">
                    {reward.cost} <span className="text-xs font-normal text-slate-500">Tokens</span>
                  </span>
                  <button
                    onClick={() => setSelectedReward(reward)}
                    disabled={!canRedeem || user.tokens < reward.cost || reward.stock === 0}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {reward.stock === 0 ? 'Out of Stock' : 'Redeem'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slot Booking Modal (Simulated inline) */}
        {selectedReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-2">Confirm Redemption</h3>
              <p className="text-slate-600 mb-6">
                You are about to redeem <strong>{selectedReward.name}</strong> for <strong>{selectedReward.cost} tokens</strong>.
                Please select a pickup slot to complete the booking.
              </p>
              
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {slots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => {
                      onRedeem(selectedReward);
                      onBookSlot(slot.id);
                      setSelectedReward(null);
                    }}
                    disabled={slot.booked >= slot.quota}
                    className="w-full p-3 border border-slate-200 rounded-lg flex justify-between items-center hover:border-blue-500 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:hover:bg-white disabled:hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar size={18} className="text-slate-400" />
                      <div className="text-left">
                        <div className="font-medium text-slate-900">
                          {new Date(slot.datetime).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {new Date(slot.datetime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold px-2 py-1 bg-slate-100 rounded text-slate-600">
                      {slot.quota - slot.booked} slots left
                    </div>
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setSelectedReward(null)}
                className="w-full py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Coins className="text-yellow-300" size={24} />
              </div>
              <span className="text-blue-100 text-sm font-medium">Available Balance</span>
            </div>
            <h2 className="text-4xl font-bold mb-1">{user.tokens}</h2>
            <p className="text-blue-200 text-sm">Token Value</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Shield size={24} />
            </div>
            <span className="text-slate-500 text-sm font-medium">Current Grade</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-1">{user.grade}</h2>
          <p className="text-slate-500 text-sm flex items-center gap-1">
             <TrendingUp size={14} className="text-green-500" /> Top 10%
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Clock size={24} />
            </div>
            <span className="text-slate-500 text-sm font-medium">Token Expiry</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {new Date(user.tokenExpiryDate).toLocaleDateString()}
          </h2>
          <p className="text-orange-600 text-xs mt-2 font-medium bg-orange-50 inline-block px-2 py-1 rounded">
            Expires in {Math.floor((new Date(user.tokenExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days
          </p>
        </div>
      </div>

      {/* Warnings */}
      {(user.inactiveMonthsConsecutive > 0 || user.inactiveMonthsCumulative > 0) && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex gap-4">
          <AlertCircle className="text-red-600 shrink-0" />
          <div>
            <h3 className="font-bold text-red-900">Activity Warning</h3>
            <p className="text-sm text-red-700 mt-1">
              You have been inactive for <strong>{user.inactiveMonthsConsecutive}</strong> consecutive months. 
              <strong> 3 months</strong> inactivity results in a Token Reset (0).
            </p>
            <div className="mt-2 text-xs text-red-600 font-mono">
              Cumulative Inactivity: {user.inactiveMonthsCumulative} months (Downgrade Risk)
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-900">Transaction History</h3>
          <button className="text-sm text-blue-600 font-medium hover:text-blue-700">View All</button>
        </div>
        <div className="divide-y divide-slate-100">
          {user.history.map((log) => (
            <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  log.type === 'EARN' ? 'bg-green-100 text-green-600' : 
                  log.type === 'SPEND' ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'
                }`}>
                  {log.type === 'EARN' ? <TrendingUp size={18} /> : log.type === 'SPEND' ? <ShoppingBag size={18} /> : <AlertCircle size={18} />}
                </div>
                <div>
                  <p className="font-medium text-slate-900">{log.description}</p>
                  <p className="text-xs text-slate-500">{new Date(log.date).toLocaleDateString()}</p>
                </div>
              </div>
              <span className={`font-bold ${log.change > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                {log.change > 0 ? '+' : ''}{log.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};