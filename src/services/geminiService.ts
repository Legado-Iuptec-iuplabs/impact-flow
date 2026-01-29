import { GoogleGenAI } from "@google/genai";
import { promptTemplates } from '../utils/aiPromptTemplates';

export async function getAISuggestion(
  fieldTitle: string,
  fieldDescription: string,
  allContext: Record<string, string>,
  artifactName: string
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn("API Key não encontrada. Retornando placeholder.");
    return `[Sugestão de IA para: ${fieldTitle}] Preencha manualmente ou configure VITE_GEMINI_API_KEY.`;
  }

  const ai = new GoogleGenAI({apiKey});
  
  const contextString = Object.entries(allContext)
    .filter(([_, v]) => v && v.trim().length > 0)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const prompt = promptTemplates.fieldSuggestion(fieldTitle, fieldDescription, contextString, artifactName);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.8 }
    });
    return response.text || "";
  } catch (error) {
    console.error("Erro no Gemini API:", error);
    return `[Sugestão de IA falhou para: ${fieldTitle}] Preencha manualmente.`;
  }
}

export async function generateBmgFull(
  source: 'idea' | 'impact_flow',
  inputData: string | Record<string, string>
): Promise<Record<string, string>> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("API Key não encontrada. Retornando objeto vazio.");
    return {};
  }

  const ai = new GoogleGenAI({apiKey});
  
  let contextInfo = "";
  if (source === 'idea') {
    contextInfo = `Ideia Central do Negócio: ${inputData}`;
  } else {
    const ctx = inputData as Record<string, string>;
    contextInfo = `Contexto do Impact Flow Canvas:
    - Desafio: ${ctx.challenge || 'Não definido'}
    - Público: ${ctx.audience || 'Não definido'}
    - Ativos: ${ctx.assets || 'Não definido'}
    - Solução IA Proposta: ${ctx.ai_solution || 'Não definida'}`;
  }

  const prompt = promptTemplates.bmgGeneration(contextInfo);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        temperature: 0.9
      }
    });
    
    const text = response.text || "{}";
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("BMG Generation Error:", err);
    return {};
  }
}

export async function generateValueMapFull(
  source: 'context' | 'impact_flow',
  inputData: string | Record<string, string>
): Promise<Record<string, string>> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("API Key não encontrada. Retornando objeto vazio.");
    return {};
  }

  const ai = new GoogleGenAI({apiKey});
  
  let contextInfo = "";
  if (source === 'context') {
    contextInfo = `Contexto do Problema/Oportunidade: ${inputData}`;
  } else {
    const ctx = inputData as Record<string, string>;
    contextInfo = `Contexto do Impact Flow Canvas:
    - Desafio: ${ctx.challenge || 'Não definido'}
    - Público: ${ctx.audience || 'Não definido'}
    - Solução IA: ${ctx.ai_solution || 'Não definida'}`;
  }

  const prompt = promptTemplates.valueMapGeneration(contextInfo);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        temperature: 0.8
      }
    });
    
    const text = response.text || "{}";
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("Value Map Error:", err);
    return {};
  }
}

export async function refineFullDocument(
  currentContent: Record<string, string>
): Promise<Record<string, string>> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("API Key não encontrada. Retornando conteúdo atual.");
    return {
      ai_solution: `[Arquitetura IA Placeholder] Configure VITE_GEMINI_API_KEY para gerar uma solução automatizada.`,
      legacy_path: currentContent.legacy_path || `[Fluxo Tradicional] Descreva como é feito hoje sem IA.`,
      success_metrics: currentContent.success_metrics || `[Métricas] Defina 2-3 KPIs claros para sucesso.`,
      implementation: currentContent.implementation || `[Implementação] Liste 3 passos práticos para o MVP.`,
      challenge: currentContent.challenge || `[Desafio] ${currentContent.challenge || 'Descreva o desafio central.'}`,
      audience: currentContent.audience || `[Público] ${currentContent.audience || 'Descreva o público alvo.'}`
    };
  }

  const ai = new GoogleGenAI({apiKey});
  const prompt = promptTemplates.documentRefinement(currentContent);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { 
        responseMimeType: "application/json",
        temperature: 1
      }
    });
    
    const text = response.text || "{}";
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (err) {
    console.error("AI Error:", err);
    // Retorna dados de placeholder em caso de erro, NÃO lança erro
    return {
      ai_solution: `[Solução IA Placeholder] Baseado no desafio: ${currentContent.challenge || 'Não definido'}`,
      legacy_path: currentContent.legacy_path || `Como seria feito tradicionalmente para: ${currentContent.challenge || 'este desafio'}`,
      success_metrics: currentContent.success_metrics || `KPIs para medir sucesso do projeto`,
      implementation: currentContent.implementation || `1. Iniciar MVP\n2. Testar com usuários\n3. Iterar baseado em feedback`,
      challenge: currentContent.challenge || '',
      audience: currentContent.audience || ''
    };
  }
}