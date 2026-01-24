import React, { useState } from 'react';
import { ARTIFACT_SCHEMAS } from './constants';
import { CanvasBox } from "@/components/CanvasBox";
import { Header } from "@/components/Header";
import { WelcomeModal } from "@/components/WelcomeModal";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { useCanvasState, useAISuggestion } from '@/hooks';
import { downloadProject, printCanvas } from "@/utils/exportHelpers";
import type { ArtifactType } from './types';


const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [isIdeaModalOpen, setIsIdeaModalOpen] = useState(false);
  const [isValueModalOpen, setIsValueModalOpen] = useState(false);
  const [tempIdeaText, setTempIdeaText] = useState('');
  const [tempValueContextText, setTempValueContextText] = useState('');
  
  const { project, handleFieldChange, updateProject } = useCanvasState();
  const { loading: aiLoading, generateBMG, generateValueMap, refineDocument } = useAISuggestion();

  const currentSchema = ARTIFACT_SCHEMAS[project.artifactType];

  const handleSmartRefine = async () => {
    if (aiLoading) return;
    try {
      const refined = await refineDocument(currentSchema.name, project.content);
      updateProject({
        content: { ...project.content, ...refined }
      });
      if (showWelcome) setShowWelcome(false);
    } catch (err) {
      console.error("Erro ao refinar:", err);
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
    try {
      const bmgData = await generateBMG('idea', tempIdeaText);
      updateProject({
        content: { ...project.content, ...bmgData }
      });
    } catch (err) {
      console.error("Erro ao gerar BMG por ideia:", err);
    }
  };

  const handleSubmitValueContext = async () => {
    if (!tempValueContextText.trim()) return;
    setIsValueModalOpen(false);
    try {
      const valueData = await generateValueMap('context', tempValueContextText);
      updateProject({
        content: { ...project.content, ...valueData }
      });
    } catch (err) {
      console.error("Erro ao gerar Mapa de Valor por contexto:", err);
    }
  };

  const handleBmgSync = async () => {
    try {
      const bmgData = await generateBMG('impact_flow', project.content);
      updateProject({
        content: { ...project.content, ...bmgData }
      });
    } catch (err) {
      console.error("Erro ao sincronizar BMG:", err);
    }
  };

  const handleValueSync = async () => {
    try {
      const valueData = await generateValueMap('impact_flow', project.content);
      updateProject({
        content: { ...project.content, ...valueData }
      });
    } catch (err) {
      console.error("Erro ao sincronizar Mapa de Valor:", err);
    }
  };

  const handleSave = () => {
    downloadProject(project);
  };

  const handlePrint = () => {
    printCanvas();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0F14] text-[#F1F5F9]">
      <Header
        projectName={project.name}
        author={project.author}
        onProjectNameChange={(name) => updateProject({ name })}
        onAuthorChange={(author) => updateProject({ author })}
        onRefine={handleSmartRefine}
        onPrint={handlePrint}
        onSave={handleSave}
        isRefining={aiLoading}
        artifactType={project.artifactType}
      />

      {/* Tabs */}
      <div className="px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between no-print border-b border-slate-900 bg-[#121820]/40 gap-4">
        <div className="flex gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 w-full md:w-auto overflow-x-auto no-scrollbar">
          {Object.values(ARTIFACT_SCHEMAS).map(schema => (
            <button
              key={schema.id}
              onClick={() => updateProject({ artifactType: schema.id as ArtifactType })}
              className={`px-4 md:px-5 py-2 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap flex-1 md:flex-none ${
                project.artifactType === schema.id 
                  ? 'bg-slate-800 text-[#2DD4BF] shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {schema.name}
            </button>
          ))}
        </div>

        {/* Dynamic Tools based on Tab */}
        <div className="flex gap-2 md:gap-3 w-full md:w-auto animate-in fade-in duration-500">
          {project.artifactType === 'BMG_PRO' && (
            <>
              <Button 
                onClick={handleBmgSync}
                variant="outline"
                size="sm"
                loading={aiLoading}
              >
                SINCRONIZAR
              </Button>
              <Button 
                onClick={handleOpenIdeaModal}
                variant="primary"
                size="sm"
              >
                IDEIA IA
              </Button>
            </>
          )}
          {project.artifactType === 'VALUE_EXP' && (
            <>
              <Button 
                onClick={handleValueSync}
                variant="outline"
                size="sm"
                loading={aiLoading}
              >
                SINCRONIZAR
              </Button>
              <Button 
                onClick={handleOpenValueModal}
                variant="primary"
                size="sm"
              >
                CONTEXTO IA
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow px-4 md:px-8 pb-12 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto mt-6 md:mt-8">
          <div 
            className="canvas-grid" 
            style={{ 
              gridTemplateColumns: `repeat(${currentSchema.gridCols}, 1fr)`,
              gridAutoFlow: 'dense' 
            }}
          >
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
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] md:text-[11px] text-slate-400 leading-relaxed font-medium">
                {project.artifactType === 'IMPACT_FLOW' 
                  ? 'Preencha os quadrantes numerados e use o Refine com IA para estruturar sua arquitetura de Inteligência Artificial.'
                  : 'Traduza sua solução técnica em valor de negócio utilizando as ferramentas de sincronização inteligente.'}
              </p>
            </div>
            
            <Button 
              onClick={handleSave}
              variant="primary"
              size="lg"
              className="w-full md:w-auto"
            >
              Salvar Estudo
            </Button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <Modal
        isOpen={isIdeaModalOpen}
        onClose={() => setIsIdeaModalOpen(false)}
        title="Ideia de Negócio"
        confirmText="Gerar"
        onConfirm={handleSubmitIdea}
      >
        <textarea 
          autoFocus
          className="w-full h-40 bg-[#0A0F14] border border-slate-800 rounded-2xl p-4 md:p-6 focus:ring-2 focus:ring-[#FDB913]/20 focus:border-[#FDB913] transition-all text-slate-300 placeholder-slate-600 resize-none outline-none mb-6 text-base md:text-lg"
          placeholder="Descreva seu negócio..."
          value={tempIdeaText}
          onChange={(e) => setTempIdeaText(e.target.value)}
        />
      </Modal>

      <Modal
        isOpen={isValueModalOpen}
        onClose={() => setIsValueModalOpen(false)}
        title="Contexto do Problema"
        confirmText="Gerar"
        onConfirm={handleSubmitValueContext}
      >
        <textarea 
          autoFocus
          className="w-full h-40 bg-[#0A0F14] border border-slate-800 rounded-2xl p-4 md:p-6 focus:ring-2 focus:ring-[#FDB913]/20 focus:border-[#FDB913] transition-all text-slate-300 placeholder-slate-600 resize-none outline-none mb-6 text-base md:text-lg"
          placeholder="Descreva o contexto do problema ou oportunidade..."
          value={tempValueContextText}
          onChange={(e) => setTempValueContextText(e.target.value)}
        />
      </Modal>

      {/* Welcome Modal */}
      <WelcomeModal
        show={showWelcome}
        challengeValue={project.content['challenge'] || ''}
        onChallengeChange={(value) => handleFieldChange('challenge', value)}
        onStartFlow={handleSmartRefine}
        onManualEntry={() => setShowWelcome(false)}
        isLoading={aiLoading}
      />
    </div>
  );
};

export default App;