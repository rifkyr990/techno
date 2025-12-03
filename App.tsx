import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { UserView } from './components/UserView';
import { AdminView } from './components/AdminView';
import { Login } from './components/Login';
import { MOCK_USER, MOCK_REWARDS, MOCK_SLOTS, SPRINT_CONVERSION_RATE } from './constants';
import { User, UserRole, SystemPhase, Reward, PickupSlot, Grade } from './types';

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>(UserRole.USER);

  // Application Data State
  const [user, setUser] = useState<User>(MOCK_USER);
  const [systemPhase, setSystemPhase] = useState<SystemPhase>(SystemPhase.ACCUMULATION);
  const [rewards, setRewards] = useState<Reward[]>(MOCK_REWARDS);
  const [slots, setSlots] = useState<PickupSlot[]>(MOCK_SLOTS);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme Effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Authentication Handlers
  const handleLogin = (email: string, role: UserRole) => {
    // In a real app, validation would happen against a backend
    setCurrentRole(role);
    setIsAuthenticated(true);
    
    // Set initial active tab based on role
    if (role === UserRole.USER) {
      setActiveTab('dashboard');
      // Ensure we are using the MOCK_USER data or fetch specific user data
      setUser(MOCK_USER); 
    } else {
      setActiveTab('system');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard'); // Reset tab
  };

  // Application Logic Handlers
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

  const handleUpdateStock = (rewardId: string, newStock: number) => {
    setRewards(prev => prev.map(r => 
      r.id === rewardId ? { ...r, stock: Math.max(0, newStock) } : r
    ));
  };

  const handleUpdateRewardImage = (rewardId: string, newImage: string) => {
    setRewards(prev => prev.map(r => 
      r.id === rewardId ? { ...r, image: newImage } : r
    ));
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout
      currentRole={currentRole}
      onLogout={handleLogout}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isDarkMode={isDarkMode}
      toggleDarkMode={toggleDarkMode}
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
          rewards={rewards}
          onUpdateStock={handleUpdateStock}
          onUpdateImage={handleUpdateRewardImage}
          activeTab={activeTab}
        />
      )}
    </Layout>
  );
}

export default App;
