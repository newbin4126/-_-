import React from 'react';
import { Moon, Power } from 'lucide-react';

interface Props {
  onDisable: () => void;
}

export const RestMode: React.FC<Props> = ({ onDisable }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-stone-900 text-stone-300 transition-colors duration-1000">
      <div className="mb-8 p-6 rounded-full bg-stone-800 shadow-inner">
        <Moon size={48} className="text-stone-400" />
      </div>
      
      <h2 className="text-2xl font-bold mb-4 text-stone-200">쉬어가도 괜찮아요</h2>
      <p className="mb-12 leading-loose text-stone-400">
        지금은 온전히 나를 위한 시간입니다.<br/>
        알림도, 목표도 잠시 내려놓으세요.<br/>
        준비가 되면 언제든 다시 돌아오세요.
      </p>

      <button
        onClick={onDisable}
        className="flex items-center gap-2 px-8 py-3 rounded-full border border-stone-700 hover:bg-stone-800 transition-colors text-stone-400 text-sm"
      >
        <Power size={16} />
        휴식 모드 종료하기
      </button>
    </div>
  );
};