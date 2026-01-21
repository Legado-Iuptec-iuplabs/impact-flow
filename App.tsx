
import React, { useState } from 'react';
import { ProjectData, ArtifactType } from './types';
import { ARTIFACT_SCHEMAS } from './constants';
import { CanvasBox } from './components/CanvasBox';
import { refineFullDocument, generateBmgFull, generateValueMapFull } from './services/geminiService';

const LogoIcon: React.FC<{ size?: string }> = ({ size = "w-8 h-8" }) => (
  <div className={`relative ${size} flex flex-col items-center justify-center`}>
    {/* Chevron de cima - Laranja */}
    <svg className="w-full h-1/2 -mb-1" viewBox="0 0 24 12" fill="none">
        <path d="M4 10L12 2L20 10" stroke="#FDB913" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    {/* Chevron de baixo - Ciano */}
    <svg className="w-full h-1/2" viewBox="0 0 24 12" fill="none">
        <path d="M4 10L12 2L20 10" stroke="#2DD4BF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isRefining, setIsRefining] = useState(false);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [tempIdeaText, setTempIdeaText] = useState('');
  const [tempValueContextText, setTempValueContextText] = useState('');
  
  const [project, setProject] = useState<ProjectData>({
    name: 'Inovação Disruptiva',
    author: 'Equipe iuptec',
    email: 'hello@iuptec.com',
    artifactType: 'IMPACT_FLOW',
    content: {}
  });

  const handleFieldChange = (id: string, value: string) => {
    setProject(prev => ({
      ...prev,
      content: { ...prev.content, [id]: value }
    }));
  };

  const handleSmartRefine = async () => {
    if (isRefining) return;
    setIsRefining(true);
    try {
      const currentSchema = ARTIFACT_SCHEMAS[project.artifactType];
      const refined = await refineFullDocument(currentSchema.name, project.content);
      setProject(prev => ({
        ...prev,
        content: { ...prev.content, ...refined }
      }));
      if (showWelcome) setShowWelcome(false);
    } catch (err) {
      console.error("Erro ao refinar:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleOpenIdeaModal = () => {
    setTempIdeaText('');
    setIsIdeaModalOpen(true);
  };

  const handleOpenValueModal = () => {
    setTempValueContextText('');
    setIsValueModalOpen(true);
  };

  const handleSubmitIdea = async () => {
    if (!tempIdeaText.trim()) return;
    setIsIdeaModalOpen(false);
    setIsRefining(true);
    try {
      const bmgData = await generateBmgFull('idea', tempIdeaText);
      setProject(prev => ({
        ...prev,
        content: { ...prev.content, ...bmgData }
      }));
    } catch (err) {
      console.error("Erro ao gerar BMG por ideia:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSubmitValueContext = async () => {
    if (!tempValueContextText.trim()) return;
    setIsValueModalOpen(false);
    setIsRefining(true);
    try {
      const valueData = await generateValueMapFull('context', tempValueContextText);
      setProject(prev => ({
        ...prev,
        content: { ...prev.content, ...valueData }
      }));
    } catch (err) {
      console.error("Erro ao gerar Mapa de Valor por contexto:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleBmgSync = async () => {
    setIsRefining(true);
    try {
      const bmgData = await generateBmgFull('impact_flow', project.content);
      setProject(prev => ({
        ...prev,
        content: { ...prev.content, ...bmgData }
      }));
    } catch (err) {
      console.error("Erro ao sincronizar BMG:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleValueSync = async () => {
    setIsRefining(true);
    try {
      const valueData = await generateValueMapFull('impact_flow', project.content);
      setProject(prev => ({
        ...prev,
        content: { ...prev.content, ...valueData }
      }));
    } catch (err) {
      console.error("Erro ao sincronizar Mapa de Valor:", err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleSave = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project));
    const dl = document.createElement('a');
    dl.setAttribute("href", dataStr);
    dl.setAttribute("download", `iuptec_${project.name.toLowerCase().replace(/\s/g, '_')}.json`);
    dl.click();
    dl.remove();
  };

  const currentSchema = ARTIFACT_SCHEMAS[project.artifactType];

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0F14] text-[#F1F5F9]">
      {/* Header */}
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
              <span className="text-slate-500 font-bold uppercase block text-[8px] mb-0.5 tracking-widest whitespace-nowrap">Projeto</span>
              <input 
                className="font-semibold text-slate-300 border-none p-0 focus:ring-0 w-full bg-transparent"
                value={project.name}
                onChange={(e) => setProject({...project, name: e.target.value})}
              />
            </div>
            <div className="group min-w-[80px]">
              <span className="text-slate-500 font-bold uppercase block text-[8px] mb-0.5 tracking-widest whitespace-nowrap">Autor</span>
              <input 
                className="font-semibold text-slate-300 border-none p-0 focus:ring-0 w-full bg-transparent"
                value={project.author}
                onChange={(e) => setProject({...project, author: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-center md:justify-end">
          {project.artifactType === 'IMPACT_FLOW' && (
            <button 
              onClick={handleSmartRefine}
              disabled={isRefining}
              className={`flex flex-1 md:flex-none items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all transform active:scale-95 ${
                isRefining ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-[#FDB913] text-[#0A0F14] hover:bg-[#FDB913]/90 shadow-lg shadow-[#FDB913]/10'
              }`}
            >
              {isRefining ? (
                <div className="w-4 h-4 border-2 border-slate-500 border-t-transparent animate-spin rounded-full"></div>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  REFINE COM IA
                </>
              )}
            </button>
          )}
          <div className="hidden md:block w-px h-6 bg-slate-800 mx-2"></div>
          <button onClick={() => window.print()} className="p-2 text-slate-500 hover:text-[#2DD4BF] transition-colors" title="Exportar PDF">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          </button>
          <button onClick={handleSave} className="p-2 text-slate-500 hover:text-[#FDB913] transition-colors" title="Salvar Trabalho">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between no-print border-b border-slate-900 bg-[#121820]/40 gap-4">
        <div className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto no-scrollbar">
          {Object.values(ARTIFACT_SCHEMAS).map(s => (
            <button
              key={s.id}
              onClick={() => setProject({...project, artifactType: s.id as ArtifactType})}
              className={`px-4 md:px-5 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-1 md:flex-none ${
                project.artifactType === s.id 
                  ? 'bg-slate-800 text-[#2DD4BF] shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>

        {/* Dynamic Tools based on Tab */}
        <div className="flex gap-2 md:gap-3 w-full md:w-auto animate-in fade-in duration-500">
          {project.artifactType === 'BMG_PRO' && (
            <>
              <button 
                onClick={handleBmgSync}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] rounded-xl text-[9px] md:text-[10px] font-bold hover:bg-[#2DD4BF]/20 transition-all shadow-sm"
              >
                SINCRONIZAR
              </button>
              <button 
                onClick={handleOpenIdeaModal}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#FDB913] text-[#0A0F14] rounded-xl text-[9px] md:text-[10px] font-bold hover:bg-[#FDB913]/90 transition-all shadow-md"
              >
                IDEIA IA
              </button>
            </>
          )}
          {project.artifactType === 'VALUE_EXP' && (
            <>
              <button 
                onClick={handleValueSync}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#2DD4BF]/10 border border-[#2DD4BF]/20 text-[#2DD4BF] rounded-xl text-[9px] md:text-[10px] font-bold hover:bg-[#2DD4BF]/20 transition-all shadow-sm"
              >
                SINCRONIZAR
              </button>
              <button 
                onClick={handleOpenValueModal}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-[#FDB913] text-[#0A0F14] rounded-xl text-[9px] md:text-[10px] font-bold hover:bg-[#FDB913]/90 transition-all shadow-md"
              >
                CONTEXTO IA
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-8 pb-12 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto mt-6 md:mt-8">
          <div className="canvas-grid" style={{ gridTemplateColumns: `repeat(${currentSchema.gridCols}, 1fr)`, gridAutoFlow: 'dense' }}>
            {currentSchema.fields.map(field => (
              <CanvasBox
                key={field.id}
                {...field}
                artifactName={currentSchema.name}
                allContext={project.content}
                value={project.content[field.id] || ''}
                onChange={handleFieldChange}
              />
            ))}
          </div>

          <div className="mt-8 md:mt-10 flex flex-col md:flex-row items-center justify-between gap-6 no-print">
            <div className="flex items-center gap-4 px-5 py-4 bg-[#121820] border border-slate-800 rounded-2xl w-full md:max-w-2xl">
              <div className="bg-[#2DD4BF]/10 text-[#2DD4BF] p-2 rounded-xl shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <p className="text-[10px] md:text-[11px] text-slate-400 leading-relaxed font-medium">
                {project.artifactType === 'IMPACT_FLOW' 
                  ? 'Preencha os quadrantes numerados e use o Refine com IA para estruturar sua arquitetura de Inteligência Artificial.'
                  : 'Traduza sua solução técnica em valor de negócio utilizando as ferramentas de sincronização inteligente.'}
              </p>
            </div>
            
            <button 
              onClick={handleSave}
              className="w-full md:w-auto px-10 py-4 bg-[#FDB913] text-[#0A0F14] rounded-2xl text-sm font-black hover:scale-105 transition-all shadow-2xl shadow-[#FDB913]/10 uppercase tracking-widest"
            >
              Salvar Estudo
            </button>
          </div>
        </div>
      </main>

      {/* Modals - Simplified for mobile */}
      {isIdeaModalOpen && (
        <div className="fixed inset-0 bg-[#0A0F14]/90 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-[#121820] rounded-3xl shadow-2xl max-w-lg w-full p-6 md:p-8 border border-slate-800 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-[#F1F5F9] mb-4">Ideia de Negócio</h3>
            <textarea 
              autoFocus
              className="w-full h-40 bg-[#0A0F14] border border-slate-800 rounded-2xl p-4 md:p-6 focus:ring-2 focus:ring-[#FDB913]/20 focus:border-[#FDB913] transition-all text-slate-300 placeholder-slate-600 resize-none outline-none mb-6 text-base md:text-lg"
              placeholder="Descreva seu negócio..."
              value={tempIdeaText}
              onChange={(e) => setTempIdeaText(e.target.value)}
            />
            <div className="flex gap-4">
              <button onClick={() => setIsIdeaModalOpen(false)} className="flex-1 py-4 text-slate-500 font-bold hover:text-slate-300 transition-colors uppercase text-[10px] tracking-widest">Cancelar</button>
              <button onClick={handleSubmitIdea} className="flex-1 py-4 bg-[#FDB913] text-[#0A0F14] rounded-2xl font-black shadow-lg hover:bg-[#FDB913]/90 transition-all uppercase text-[10px] tracking-widest">Gerar</button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding iuptec - Responsive Redesign */}
      {showWelcome && (
        <div className="fixed inset-0 bg-[#0A0F14] z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="absolute top-0 right-0 w-full md:w-[800px] h-full md:h-[800px] bg-[#FDB913]/5 rounded-full blur-[100px] md:blur-[160px] opacity-50 md:opacity-100"></div>
          
          <div className="bg-[#121820] rounded-[24px] md:rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] max-w-6xl w-full flex flex-col md:flex-row overflow-hidden border border-slate-800 relative z-10 max-h-[95vh] md:max-h-none">
            {/* Left Section / Header on Mobile */}
            <div className="w-full md:w-5/12 p-8 md:p-16 bg-slate-900/40 flex flex-col justify-center relative border-b md:border-b-0 md:border-r border-slate-800 shrink-0">
               <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-8">
                 <LogoIcon size="w-10 h-10 md:w-12 h-12" />
                 <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                    <span className="text-[#2DD4BF]">iup</span>
                    <span className="text-[#FDB913]">tec</span>
                 </h1>
              </div>
              <h2 className="text-xl md:text-2xl font-light text-slate-300 mb-6 md:mb-8 leading-tight">
                Transformamos desafios complexos em <span className="text-[#2DD4BF] font-bold">vantagens competitivas</span> através de IA estratégica.
              </h2>
              <div className="hidden md:block">
                <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">Arquitetura | Business | IA</p>
              </div>
            </div>

            {/* Right Section / Form */}
            <div className="w-full md:w-7/12 p-8 md:p-16 flex flex-col bg-[#121820] overflow-y-auto">
              <div className="flex-grow space-y-6 md:space-y-8">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-3">Qual o seu ponto de partida?</label>
                  <textarea 
                    className="w-full h-32 md:h-48 bg-[#0A0F14] border border-slate-800 rounded-[16px] md:rounded-[24px] p-6 md:p-8 focus:ring-2 focus:ring-[#2DD4BF]/20 focus:border-[#2DD4BF] transition-all text-lg md:text-xl font-medium text-slate-100 placeholder-slate-700 resize-none outline-none shadow-inner"
                    placeholder="Ex: Queremos automatizar o suporte técnico..."
                    value={project.content['challenge'] || ''}
                    onChange={(e) => handleFieldChange('challenge', e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-8 md:mt-12 flex flex-col gap-4">
                <button 
                  onClick={handleSmartRefine}
                  disabled={!project.content['challenge'] || isRefining}
                  className="w-full py-4 md:py-5 bg-[#FDB913] text-[#0A0F14] rounded-2xl font-black text-lg md:text-xl hover:scale-[1.01] active:scale-95 transition-all shadow-2xl shadow-[#FDB913]/10 disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-tight"
                >
                  {isRefining ? 'Gerando...' : 'INICIAR IMPACT FLOW'}
                </button>
                <button 
                  onClick={() => setShowWelcome(false)}
                  className="text-center text-[10px] md:text-xs text-slate-500 hover:text-slate-300 font-bold uppercase tracking-widest transition-colors py-2"
                >
                  ENTRAR NO STUDIO MANUALMENTE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
