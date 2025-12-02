import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

const steps = [
  {
    title: "반가워요",
    desc: "너무 빠르지 않아도 괜찮아요.\n나만의 속도로 걷는 연습을 시작해봐요.",
    image: "🌱"
  },
  {
    title: "작은 성공",
    desc: "물 한 잔 마시기, 창문 열기처럼\n아주 작은 일부터 시작하면 돼요.",
    image: "💧"
  },
  {
    title: "따뜻한 기록",
    desc: "당신의 모든 걸음을 응원할게요.\n오늘 하루를 따뜻하게 채워보세요.",
    image: "📔"
  }
];

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);

  const handleNext = () => {
    if (current < steps.length - 1) {
      setCurrent(current + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-50 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
      <div className="flex-1 flex flex-col justify-center items-center max-w-sm w-full">
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-6xl shadow-sm mb-8 animate-float border-4 border-stone-100">
          {steps[current].image}
        </div>
        
        <h2 className="text-2xl font-bold text-stone-700 mb-4 font-sans tracking-tight">
          {steps[current].title}
        </h2>
        
        <p className="text-stone-500 whitespace-pre-line leading-relaxed mb-12">
          {steps[current].desc}
        </p>

        <div className="flex gap-2 mb-12">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? 'w-8 bg-stone-700' : 'w-2 bg-stone-300'
              }`}
            />
          ))}
        </div>
      </div>

      <button
        onClick={handleNext}
        className="w-full max-w-xs bg-stone-800 text-white py-4 rounded-xl font-medium active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg shadow-stone-200"
      >
        {current === steps.length - 1 ? '시작하기' : '다음으로'}
        <ChevronRight size={20} />
      </button>
    </div>
  );
};