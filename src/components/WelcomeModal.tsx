import React from 'react';
import { Button } from './Button';

interface WelcomeModalProps {
  show: boolean;
  challengeValue: string;
  onChallengeChange: (value: string) => void;
  onStartFlow: () => void;
  onManualEntry: () => void;
  isLoading: boolean;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  show,
  challengeValue,
  onChallengeChange,
  onStartFlow,
  onManualEntry,
  isLoading
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-[#0A0F14] z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="absolute top-0 right-0 w-full md:w-[800px] h-full md:h-[800px] bg-[#FDB913]/5 rounded-full blur-[100px] md:blur-[160px] opacity-50 md:opacity-100"></div>
      
      <div className="bg-[#121820] rounded-[24px] md:rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-6xl w-full flex flex-col md:flex-row overflow-hidden border border-slate-800 relative z-10 max-h-[95vh] md:max-h-none">
        {/* Left Section */}
        <div className="w-full md:w-5/12 p-8 md:p-16 bg-slate-900/40 flex flex-col justify-center relative border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
          <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
            <div className="relative w-10 h-10 md:w-12 md:h-12 flex flex-col items-center justify-center">
              <svg className="w-full h-1/2 -mb-1" viewBox="0 0 24 12" fill="none">
                <path d="M4 10L12 2L20 10" stroke="#FDB913" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg className="w-full h-1/2" viewBox="0 0 24 12" fill="none">
                <path d="M4 10L12 2L20 10" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">
              <span className="text-[#2DD4BF]">iup</span>
              <span className="text-[#FDB913]">tec</span>
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl font-light text-slate-300 mb-6 md:mb-8 leading-tight">
            Transformamos desafios complexos em <span className="text-[#2DD4BF] font-bold">vantagens competitivas</span> através de IA estratégica.
          </h2>
          <div className="hidden md:block">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
              Arquitetura | Business | IA
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col bg-[#121820] overflow-y-auto">
          <div className="flex-grow space-y-6 md:space-y-8">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">
                Qual o seu ponto de partida?
              </label>
              <textarea 
                className="w-full h-32 md:h-48 bg-[#0A0F14] border border-slate-800 rounded-[16px] md:rounded-[24px] p-6 md:p-8 focus:ring-2 focus:ring-[#2DD4BF]/20 focus:border-[#2DD4BF] transition-all text-lg md:text-xl font-medium text-slate-100 placeholder-slate-700 resize-none outline-none shadow-inner"
                placeholder="Ex: Queremos automatizar o suporte técnico..."
                value={challengeValue}
                onChange={(e) => onChallengeChange(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-8 md:mt-12 flex flex-col gap-4">
            <Button 
              onClick={onStartFlow}
              disabled={!challengeValue || isLoading}
              loading={isLoading}
              className="w-full"
            >
              {isLoading ? 'Gerando...' : 'INICIAR IMPACT FLOW'}
            </Button>
            <button 
              onClick={onManualEntry}
              className="text-center text-[10px] md:text-xs text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest transition-colors py-2"
            >
              ENTRAR NO STUDIO MANUALMENTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};