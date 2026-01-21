
import React, { useState } from 'react';
import { getAISuggestion } from '../services/geminiService';

interface CanvasBoxProps {
  id: string;
  title: string;
  placeholder: string;
  description: string;
  number?: string;
  value: string;
  onChange: (id: string, value: string) => void;
  allContext: Record<string, string>;
  artifactName: string;
  colSpan?: number;
  rowSpan?: number;
}

export const CanvasBox: React.FC<CanvasBoxProps> = ({
  id, title, placeholder, description, number, value, onChange, allContext, artifactName, colSpan = 4, rowSpan = 1
}) => {
  const [loading, setLoading] = useState(false);
  const isAISolutionField = id === 'ai_solution';

  const handleAISuggestion = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const suggestion = await getAISuggestion(title, description, allContext, artifactName);
      onChange(id, suggestion);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className={`canvas-box border-slate-800 group flex flex-col transition-all duration-300 ${
        isAISolutionField ? 'ring-inset ring-1 ring-[#2DD4BF]/30 bg-[#2DD4BF]/5' : ''
      }`} 
      style={{ 
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`
      }}
    >
      {number && (
        <div className={`bg-number ${isAISolutionField ? 'text-[#2DD4BF]/10' : ''}`}>
          {number}
        </div>
      )}
      
      <div className="content-layer h-full flex flex-col relative">
        <div className="flex justify-between items-start mb-1">
          <h3 className={`font-bold text-[10px] uppercase tracking-wider ${
            isAISolutionField ? 'text-[#2DD4BF]' : 'text-slate-400'
          }`}>
            {title}
            {isAISolutionField && <span className="ml-2 text-[8px] bg-[#2DD4BF] text-[#0A0F14] px-1.5 py-0.5 rounded-sm lowercase font-bold">IA CORE</span>}
          </h3>
          <button
            onClick={handleAISuggestion}
            disabled={loading}
            title="Sugerir com IA"
            className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all disabled:opacity-50 ${
              isAISolutionField ? 'bg-[#2DD4BF] text-[#0A0F14] hover:scale-110' : 'bg-[#2DD4BF]/10 text-[#2DD4BF] hover:bg-[#2DD4BF]/20'
            }`}
          >
            {loading ? (
              <div className={`w-4 h-4 border-2 border-t-transparent animate-spin rounded-full ${
                isAISolutionField ? 'border-[#0A0F14]' : 'border-[#2DD4BF]'
              }`}></div>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </button>
        </div>
        
        <p className={`text-[9px] leading-tight mb-3 pr-6 italic ${
          isAISolutionField ? 'text-[#2DD4BF]/70' : 'text-slate-500'
        }`}>{description}</p>
        
        <textarea
          className={`flex-grow w-full bg-transparent border-none focus:ring-0 placeholder-slate-700 resize-none text-sm leading-relaxed ${
            isAISolutionField ? 'text-[#F1F5F9] font-medium' : 'text-[#CBD5E1]'
          }`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
        />
      </div>
    </div>
  );
};
