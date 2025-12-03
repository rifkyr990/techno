import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { UserView } from './components/UserView';
import { AdminView } from './components/AdminView';
import { MOCK_USER, MOCK_REWARDS, MOCK_SLOTS, SPRINT_CONVERSION_RATE } from './constants';
import { User, UserRole, SystemPhase, Reward, PickupSlot, Grade } from './types';

function App() {
  // State
  const [user, setUser] = useState<User>(MOCK_USER);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.USER); // Controls View Only
  const [systemPhase, setSystemPhase] = useState<SystemPhase>(SystemPhase.ACCUMULATION);
  const [rewards, setRewards] = useState<Reward[]>(MOCK_REWARDS);
  const [slots, setSlots] = useState<PickupSlot[]>(MOCK_SLOTS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);

  // Handlers
  const handleSwitchRole = () => {
    const newRole = currentRole === UserRole.USER ? UserRole.ADMIN : UserRole.USER;
    setCurrentRole(newRole);
    setActiveTab(newRole === UserRole.USER ? 'dashboard' : 'system');
  };

  const handleUploadSprintData = (sprintName: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate Processing Excel
      // 1. Add Tokens
      // 2. Reset Consecutive Inactivity if active
      // 3. Increment Cumulative Inactivity if inactive (Simulated as active here for demo)
      
      const newTokens = user.tokens + SPRINT_CONVERSION_RATE;
      
      setUser(prev => ({
        ...prev,
        tokens: newTokens,
        inactiveMonthsConsecutive: 0, // Reset because they were active in this sprint upload
        history: [
          {
            id: `h-${Date.now()}`,
            date: new Date().toISOString(),
            description: `Sprint Upload: ${sprintName}`,
            change: SPRINT_CONVERSION_RATE,
            type: 'EARN'
          },
          ...prev.history
        ]
      }));
      
      setIsProcessing(false);
      alert(`Successfully processed sprint data. ${user.name} received ${SPRINT_CONVERSION_RATE} tokens.`);
    }, 1500);
  };

  const handleRunBatchProcess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      let newUser = { ...user };
      let logs = [...user.history];
      let triggered = false;

      // 1. Logic RESET (Hard Penalty)
      // If inactive 3 months consecutive -> Tokens 0
      if (user.inactiveMonthsConsecutive >= 3) {
        const resetAmount = -user.tokens;
        newUser.tokens = 0;
        logs.unshift({
          id: `h-reset-${Date.now()}`,
          date: new Date().toISOString(),
          description: 'PENALTY: 3 Months Consecutive Inactivity (Reset)',
          change: resetAmount,
          type: 'PENALTY'
        });
        triggered = true;
      }

      // 2. Logic DOWNGRADE (Soft Penalty)
      // If inactive 3 months cumulative -> Grade Down & Tokens -50%
      // Only apply if Reset didn't happen (or apply both depending on specific business rule interpretation, usually Reset overrides)
      if (!triggered && user.inactiveMonthsCumulative >= 3) {
        const penaltyAmount = Math.floor(user.tokens * -0.5);
        newUser.tokens = user.tokens + penaltyAmount;
        
        // Downgrade Grade Logic
        let newGrade = user.grade;
        if (user.grade === Grade.DIAMOND) newGrade = Grade.RUBY;
        else if (user.grade === Grade.RUBY) newGrade = Grade.SAPPHIRE;
        
        newUser.grade = newGrade;
        
        logs.unshift({
          id: `h-down-${Date.now()}`,
          date: new Date().toISOString(),
          description: `PENALTY: Cumulative Inactivity. Downgrade to ${newGrade} & 50% Token Cut`,
          change: penaltyAmount,
          type: 'PENALTY'
        });
        triggered = true;
      }

      if (!triggered) {
        alert("Batch process completed. No penalties applicable for this user.");
      } else {
        setUser({ ...newUser, history: logs });
        alert("Batch process completed. Penalties applied.");
      }
      
      setIsProcessing(false);
    }, 2000);
  };

  const handleRedeem = (reward: Reward) => {
    if (user.tokens < reward.cost) return;

    setUser(prev => ({
      ...prev,
      tokens: prev.tokens - reward.cost,
      history: [
        {
          id: `h-redeem-${Date.now()}`,
          date: new Date().toISOString(),
          description: `Redeemed: ${reward.name}`,
          change: -reward.cost,
          type: 'SPEND'
        },
        ...prev.history
      ]
    }));

    // Update stock
    setRewards(prev => prev.map(r => 
      r.id === reward.id ? { ...r, stock: r.stock - 1 } : r
    ));
  };

  const handleBookSlot = (slotId: string) => {
    setSlots(prev => prev.map(slot => 
      slot.id === slotId ? { ...slot, booked: slot.booked + 1 } : slot
    ));
    alert("Slot booked successfully! Please bring your ID on Fulfillment Day.");
  };

  return (
    <Layout
      currentRole={currentRole}
      onSwitchRole={handleSwitchRole}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {currentRole === UserRole.USER ? (
        <UserView
          user={user}
          activeTab={activeTab}
          systemPhase={systemPhase}
          rewards={rewards}
          slots={slots}
          onRedeem={handleRedeem}
          onBookSlot={handleBookSlot}
        />
      ) : (
        <AdminView 
          currentPhase={systemPhase}
          setSystemPhase={setSystemPhase}
          onUploadSprintData={handleUploadSprintData}
          onRunBatchProcess={handleRunBatchProcess}
          isProcessing={isProcessing}
        />
      )}
    </Layout>
  );
}

export default App;