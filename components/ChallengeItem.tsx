import React from 'react';
import { Challenge, CATEGORY_COLORS, CATEGORY_LABELS } from '../types';
import { Check, Edit3 } from 'lucide-react';

interface Props {
  challenge: Challenge;
  onComplete: (id: string) => void;
  onReflect: (id: string, text: string) => void;
}

export const ChallengeItem: React.FC<Props> = ({ challenge, onComplete, onReflect }) => {
  const [isReflecting, setIsReflecting] = React.useState(false);
  const [reflectionText, setReflectionText] = React.useState(challenge.reflection || '');

  const handleSubmitReflection = () => {
    if (reflectionText.trim()) {
      onReflect(challenge.id, reflectionText);
      setIsReflecting(false);
    }
  };

  if (challenge.completed) {
    return (
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 opacity-80">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <span className="text-xs text-stone-400 line-through">
                {CATEGORY_LABELS[challenge.category]}
            </span>
            <h3 className="text-stone-400 line-through mt-1">{challenge.title}</h3>
          </div>
          <div className="bg-stone-200 p-2 rounded-full text-stone-500">
            <Check size={16} />
          </div>
        </div>
        
        {challenge.reflection ? (
          <div className="mt-2 text-sm text-stone-500 bg-white p-3 rounded-xl handwritten text-lg border border-stone-100">
            "{challenge.reflection}"
          </div>
        ) : (
          !isReflecting ? (
            <button 
                onClick={() => setIsReflecting(true)}
                className="mt-2 text-xs text-stone-400 flex items-center gap-1 hover:text-stone-600"
            >
                <Edit3 size={12} /> 한 줄 회고 남기기
            </button>
          ) : (
             <div className="mt-2 animate-fade-in">
                <input
                    type="text"
                    value={reflectionText}
                    onChange={(e) => setReflectionText(e.target.value)}
                    placeholder="어땠나요? 짧게 기록해봐요."
                    className="w-full text-sm p-2 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 bg-white"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitReflection()}
                />
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => setIsReflecting(false)} className="text-xs text-stone-400">취소</button>
                    <button onClick={handleSubmitReflection} className="text-xs text-stone-600 font-medium">저장</button>
                </div>
             </div>
          )
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 transform transition-all hover:scale-[1.02] active:scale-[0.98]">
      <div className="flex justify-between items-center">
        <div>
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${CATEGORY_COLORS[challenge.category]}`}>
            {CATEGORY_LABELS[challenge.category]}
          </span>
          <h3 className="text-stone-700 font-medium text-lg mt-2">{challenge.title}</h3>
          <p className="text-xs text-stone-400 mt-1">+{challenge.xpReward} XP</p>
        </div>
        
        <button
          onClick={() => onComplete(challenge.id)}
          className="w-12 h-12 rounded-full border-2 border-stone-100 hover:bg-stone-50 flex items-center justify-center text-stone-300 hover:text-stone-400 transition-colors"
        >
          <Check size={24} />
        </button>
      </div>
    </div>
  );
};