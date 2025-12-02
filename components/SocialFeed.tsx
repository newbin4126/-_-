import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { FeedItem, CATEGORY_COLORS, CATEGORY_LABELS } from '../types';
import { Heart } from 'lucide-react';

export const SocialFeed: React.FC = () => {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [cheered, setCheered] = useState<Set<string>>(new Set());

  useEffect(() => {
    setFeed(db.getFeed());
    const interval = setInterval(() => {
        setFeed(db.getFeed());
    }, 5000); // Polling for demo
    return () => clearInterval(interval);
  }, []);

  const handleCheer = (id: string) => {
    if (cheered.has(id)) return;
    
    db.cheerPost(id);
    setCheered(prev => new Set(prev).add(id));
    
    // Optimistic UI update
    setFeed(prev => prev.map(item => 
      item.id === id ? { ...item, cheers: item.cheers + 1 } : item
    ));
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff/60000)}분 전`;
    return `${Math.floor(diff/3600000)}시간 전`;
  };

  return (
    <div className="space-y-4 pb-24">
      <div className="px-1 pt-2 pb-4">
        <h2 className="text-xl font-bold text-stone-700">함께 걷는 사람들</h2>
        <p className="text-sm text-stone-400">익명으로 서로의 하루를 응원해요</p>
      </div>

      {feed.map(item => (
        <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${CATEGORY_COLORS[item.category]}`}>
                {CATEGORY_LABELS[item.category]}
              </span>
              <span className="text-xs text-stone-400">{formatTime(item.timestamp)}</span>
            </div>
            <h3 className="text-stone-700 font-medium">{item.challengeTitle}</h3>
          </div>
          
          <button 
            onClick={() => handleCheer(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
              cheered.has(item.id) ? 'text-rose-400 bg-rose-50' : 'text-stone-300 hover:bg-stone-50'
            }`}
          >
            <Heart 
                size={24} 
                fill={cheered.has(item.id) || item.isMine ? "currentColor" : "none"} 
                className="transition-transform active:scale-75"
            />
            <span className="text-xs font-medium">{item.cheers}</span>
          </button>
        </div>
      ))}

      {feed.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          아직 공유된 이야기가 없어요.<br/>
          오늘의 작은 성공을 공유해보세요.
        </div>
      )}
    </div>
  );
};