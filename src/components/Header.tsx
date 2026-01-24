import React from 'react';

interface HeaderProps {
  projectName: string;
  author: string;
  onProjectNameChange: (name: string) => void;
  onAuthorChange: (author: string) => void;
  onRefine: () => void;
  onPrint: () => void;
  onSave: () => void;
  isRefining: boolean;
  artifactType: string;
}

const LogoIcon: React.FC<{ size?: string }> = ({ size = "w-8 h-8" }) => (
  <div className={`relative ${size} flex flex-col items-center justify-center`}>
    <svg className="w-full h-1/2 -mb-1" viewBox="0 0 24 12" fill="none">
      <path d="M4 10L12 2L20 10" stroke="#FDB913" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <svg className="w-full h-1/2" viewBox="0 0 24 12" fill="none">
      <path d="M4 10L12 2L20 10" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export const Header: React.FC<HeaderProps> = ({
  projectName,
  author,
  onProjectNameChange,
  onAuthorChange,
  onRefine,
  onPrint,
  onSave,
  isRefining,
  artifactType
}) => {
  return (
    <header className="bg-[#121820]/80 backdrop-blur-md border-b border-slate-800 px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between no-print sticky top-0 z-50 gap-4">
      <div className="flex items-center gap-4 md:gap-6 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-3">
          <LogoIcon size="w-7 h-7" />
          <div className="text-2xl font-black tracking-tight flex items-center">
            <span className="text-[#2DD4BF]">iup</span>
            <span className="text-[#FDB913]">tec</span>
          </div>
        </div>
        
        <div className="hidden md:block h-8 w-px bg-slate-800"></div>
        
        <div className="flex gap-4 md:gap-6 text-xs overflow-x-auto no-scrollbar">
          <div className="group min-w-[100px]">
            <span className="text-slate-500 font-bold uppercase block text-[8px] mb-0.5 tracking-widest whitespace-nowrap">
              Projeto
            </span>
            <input 
              className="font-semibold text-slate-300 border-none p-0 focus:ring-0 w-full bg-transparent"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
            />
          </div>
          <div className="group min-w-[80px]">
            <span className="text-slate-500 font-bold uppercase block text-[8px] mb-0.5 tracking-widest whitespace-nowrap">
              Autor
            </span>
            <input 
              className="font-semibold text-slate-300 border-none p-0 focus:ring-0 w-full bg-transparent"
              value={author}
              onChange={(e) => onAuthorChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
        {artifactType === 'IMPACT_FLOW' && (
          <button 
            onClick={onRefine}
            disabled={isRefining}
            className={`flex flex-1 md:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all transform active:scale-95 ${
              isRefining 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-[#FDB913] text-[#0A0F14] hover:bg-[#FDB913]/90 shadow-lg shadow-[#FDB913]/10'
            }`}
          >
            {isRefining ? (
              <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent animate-spin rounded-full"></div>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                REFINE COM IA
              </>
            )}
          </button>
        )}
        <div className="hidden md:block w-px h-6 bg-slate-800 mx-2"></div>
        <button 
          onClick={onPrint} 
          className="p-2 text-slate-500 hover:text-[#2DD4BF] transition-colors" 
          title="Exportar PDF"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>
        <button 
          onClick={onSave} 
          className="p-2 text-slate-500 hover:text-[#FDB913] transition-colors" 
          title="Salvar Trabalho"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
      </div>
    </header>
  );
};