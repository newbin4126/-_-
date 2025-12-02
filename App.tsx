import React, { useState, useEffect } from 'react';
import { db } from './services/db';
import { getEncouragement, getSuggestedChallenge } from './services/geminiService';
import { User, Challenge, ChallengeCategory, LEVELS } from './types';
import { Onboarding } from './components/Onboarding';
import { RestMode } from './components/RestMode';
import { SocialFeed } from './components/SocialFeed';
import { ChallengeItem } from './components/ChallengeItem';
import { Home, Coffee, Users, Plus, Leaf, X } from 'lucide-react';

// Main App
export default function App() {
  const [user, setUser] = useState<User>(db.getUser());
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [activeTab, setActiveTab] = useState<'home' | 'social'>('home');
  const [showAddModal, setShowAddModal] = useState(false);
  const [encouragement, setEncouragement] = useState<string | null>(null);
  
  // New Challenge State
  const [newChallengeTitle, setNewChallengeTitle] = useState('');
  const [newChallengeCategory, setNewChallengeCategory] = useState<ChallengeCategory>(ChallengeCategory.POSITIVITY);
  const [aiSuggestion, setAiSuggestion] = useState('');

  useEffect(() => {
    setChallenges(db.getChallenges());
  }, []);

  const refreshUser = () => setUser(db.getUser());

  const handleOnboardingComplete = () => {
    const updated = db.updateUser({ isOnboarded: true });
    setUser(updated);
  };

  const toggleRestMode = () => {
    const newVal = !user.isRestMode;
    const updated = db.updateUser({ isRestMode: newVal });
    setUser(updated);
  };

  const handleCompleteChallenge = async (id: string) => {
    const challenge = challenges.find(c => c.id === id);
    if (!challenge) return;

    // 1. Mark complete locally
    const updatedChallenges = db.updateChallenge(id, { 
        completed: true, 
        completedAt: Date.now() 
    });
    setChallenges(updatedChallenges);

    // 2. Update User XP
    const newXp = user.xp + challenge.xpReward;
    
    // Level calc: simplified for demo
    let newLevel = user.level;
    for (const lvl of LEVELS) {
        if (newXp >= lvl.minXp) newLevel = lvl.level;
    }
    
    const updatedUser = db.updateUser({ xp: newXp, level: newLevel });
    setUser(updatedUser);

    // 3. Show Encouragement
    const msg = await getEncouragement(challenge.title);
    setEncouragement(msg);
    setTimeout(() => setEncouragement(null), 4000);

    // 4. Optionally share to feed (simulated auto-prompt or user action)
    // For demo simplicity, we assume explicit sharing is a separate button, 
    // but here we might add it to "My History".
  };

  const handleReflect = (id: string, text: string) => {
    const updated = db.updateChallenge(id, { reflection: text });
    setChallenges(updated);
    
    // Post to feed logic could go here if user opted in
    const challenge = challenges.find(c => c.id === id);
    if (challenge) {
       // Auto-share to "Social" for demo purposes to populate feed
       db.addToFeed({
           id: Date.now().toString(),
           challengeTitle: challenge.title,
           category: challenge.category,
           timestamp: Date.now(),
           cheers: 0,
           isMine: true
       });
    }
  };

  const handleAddChallenge = () => {
    if (!newChallengeTitle.trim()) return;

    const newC: Challenge = {
        id: Date.now().toString(),
        title: newChallengeTitle,
        category: newChallengeCategory,
        xpReward: 20, // fixed for simplicity
        completed: false
    };

    const updated = db.addChallenge(newC);
    setChallenges(updated);
    setShowAddModal(false);
    setNewChallengeTitle('');
  };

  const fetchSuggestion = async () => {
      setAiSuggestion('생각 중...');
      const suggestion = await getSuggestedChallenge();
      setNewChallengeTitle(suggestion);
      setAiSuggestion('');
  }

  // --- Render ---

  if (!user.isOnboarded) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  if (user.isRestMode) {
    return <RestMode onDisable={toggleRestMode} />;
  }

  const currentLevelInfo = LEVELS.find(l => l.level === user.level) || LEVELS[0];
  const nextLevelInfo = LEVELS.find(l => l.level === user.level + 1);
  const progressPercent = nextLevelInfo 
    ? ((user.xp - currentLevelInfo.minXp) / (nextLevelInfo.minXp - currentLevelInfo.minXp)) * 100 
    : 100;

  const activeChallenges = challenges.filter(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed); // In a real app, filter by "today"

  return (
    // h-[100dvh] ensures the app takes exactly the full viewport height, keeping the nav fixed at bottom
    <div className="h-[100dvh] bg-stone-50 text-stone-800 font-sans flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden relative">
      
      {/* Header */}
      <header className="px-6 py-6 bg-white rounded-b-3xl shadow-sm z-10 shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-stone-700">Todok</span>
            <span className="text-xs bg-stone-100 text-stone-500 px-2 py-1 rounded-full">Lv.{user.level} {currentLevelInfo.title}</span>
          </div>
          <button onClick={toggleRestMode} className="p-2 bg-stone-100 rounded-full text-stone-400 hover:bg-stone-200">
            <Coffee size={18} />
          </button>
        </div>

        {/* Character / Progress Area */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-pastel-green rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white">
            {user.level === 1 ? "🌱" : user.level === 2 ? "🌿" : user.level === 3 ? "🌳" : "🍎"}
          </div>
          <div className="flex-1">
             <div className="flex justify-between text-xs text-stone-400 mb-1">
                <span>성장 중...</span>
                <span>{Math.floor(progressPercent)}%</span>
             </div>
             <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-1000" 
                    style={{ width: `${progressPercent}%` }}
                />
             </div>
             <p className="text-xs text-stone-400 mt-2">
                다음 레벨까지 {nextLevelInfo ? nextLevelInfo.minXp - user.xp : 0} XP 남았어요
             </p>
          </div>
        </div>
      </header>

      {/* Main Content - flex-1 allows it to fill remaining space and scroll */}
      <main className="flex-1 overflow-y-auto p-6 hide-scrollbar relative">
        {activeTab === 'home' ? (
            <div className="space-y-6 pb-24">
                {/* Active List */}
                <div>
                    <h2 className="text-lg font-bold text-stone-700 mb-4 flex items-center gap-2">
                        오늘의 작은 목표 
                        <span className="text-xs font-normal text-stone-400 bg-white px-2 py-0.5 rounded-full border border-stone-100">
                            {activeChallenges.length}
                        </span>
                    </h2>
                    
                    {activeChallenges.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-stone-200">
                            <p className="text-stone-400 mb-4">아직 등록된 목표가 없어요.</p>
                            <button 
                                onClick={() => setShowAddModal(true)}
                                className="text-sm bg-stone-800 text-white px-4 py-2 rounded-lg"
                            >
                                첫 목표 만들기
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activeChallenges.map(c => (
                                <ChallengeItem 
                                    key={c.id} 
                                    challenge={c} 
                                    onComplete={handleCompleteChallenge}
                                    onReflect={handleReflect}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Completed List (Collapsible ideally, but list for now) */}
                {completedChallenges.length > 0 && (
                    <div className="opacity-60">
                         <h2 className="text-sm font-bold text-stone-400 mb-3 mt-8">완료한 일들</h2>
                         <div className="space-y-3">
                            {completedChallenges.map(c => (
                                <ChallengeItem 
                                    key={c.id} 
                                    challenge={c} 
                                    onComplete={() => {}} 
                                    onReflect={handleReflect}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <SocialFeed />
        )}
      </main>

      {/* FAB - Add Button */}
      {activeTab === 'home' && (
        <button 
            onClick={() => setShowAddModal(true)}
            className="absolute bottom-24 right-6 w-14 h-14 bg-stone-800 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-20"
        >
            <Plus size={28} />
        </button>
      )}

      {/* Bottom Nav - Fixed at bottom naturally by flex layout */}
      <nav className="bg-white border-t border-stone-100 px-6 py-4 flex justify-around items-center z-30 pb-safe shrink-0">
        <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-stone-800' : 'text-stone-300'}`}
        >
            <Home size={24} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">홈</span>
        </button>
        <button 
             onClick={() => setActiveTab('social')}
             className={`flex flex-col items-center gap-1 ${activeTab === 'social' ? 'text-stone-800' : 'text-stone-300'}`}
        >
            <Users size={24} strokeWidth={activeTab === 'social' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">함께</span>
        </button>
      </nav>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl mb-4 sm:mb-0">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-stone-700">새로운 목표</h3>
                    <button onClick={() => setShowAddModal(false)}><X className="text-stone-400" /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-stone-500 font-medium mb-2 block">어떤 종류인가요?</label>
                        <div className="flex gap-2">
                            {Object.values(ChallengeCategory).map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setNewChallengeCategory(cat)}
                                    className={`flex-1 py-2 text-xs rounded-lg border transition-colors ${
                                        newChallengeCategory === cat 
                                        ? 'bg-stone-800 text-white border-stone-800' 
                                        : 'bg-white text-stone-500 border-stone-200'
                                    }`}
                                >
                                    {cat === 'POSITIVITY' ? '적극성' : cat === 'LEARNING' ? '배움' : '교류'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-stone-500 font-medium mb-2 block flex justify-between">
                             <span>무엇을 해볼까요?</span>
                             <button onClick={fetchSuggestion} className="text-emerald-500 flex items-center gap-1">
                                <Leaf size={10} /> {aiSuggestion || "AI 추천받기"}
                             </button>
                        </label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400"
                            placeholder="예: 물 한 잔 마시기"
                            value={newChallengeTitle}
                            onChange={(e) => setNewChallengeTitle(e.target.value)}
                        />
                    </div>

                    <button 
                        onClick={handleAddChallenge}
                        disabled={!newChallengeTitle.trim()}
                        className="w-full py-3 bg-stone-800 text-white rounded-xl font-medium mt-4 disabled:opacity-50"
                    >
                        등록하기
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Encouragement Toast */}
      {encouragement && (
        <div className="fixed top-20 left-6 right-6 z-50 animate-float">
            <div className="bg-white/90 backdrop-blur border border-stone-200 p-4 rounded-xl shadow-lg text-center">
                <p className="text-stone-700 font-medium handwritten text-xl">
                    "{encouragement}"
                </p>
            </div>
        </div>
      )}
    </div>
  );
}