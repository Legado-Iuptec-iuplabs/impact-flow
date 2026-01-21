
import { GoogleGenAI } from "@google/genai";

export async function getAISuggestion(
  fieldTitle: string,
  fieldDescription: string,
  allContext: Record<string, string>,
  artifactName: string
): Promise<string> {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey });
  
  const contextString = Object.entries(allContext)
    .filter(([_, v]) => v && v.trim().length > 0)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const prompt = `
    Você é um Arquiteto de Estratégia e IA Sênior do Impact Flow.
    Documento: "${artifactName}".
    Campo: "${fieldTitle}" (${fieldDescription}).
    Contexto Atual:
    ${contextString || "Iniciando agora."}

    Sua missão: Propor um texto altamente estratégico, curto e inovador.
    Responda APENAS com a sugestão, sem introduções.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.8 }
    });
    return response.text || "";
  } catch (error) {
    return "Erro ao gerar sugestão.";
  }
}

export async function generateBmgFull(
  source: 'idea' | 'impact_flow',
  inputData: string | Record<string, string>
): Promise<Record<string, string>> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return {};

  const ai = new GoogleGenAI({ apiKey });
  
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

  const prompt = `
    Aja como um Arquiteto de Modelos de Negócios Sênior. Sua tarefa é preencher TODO o Business Model Canvas (BMG) com base no contexto fornecido.
    Contexto: ${contextInfo}

    Preencha os seguintes campos com textos estratégicos, curtos e profissionais:
    - kp (Parceiros Chave)
    - ka (Atividades Chave)
    - vp (Proposta de Valor) - Este é o coração do modelo.
    - cr (Relacionamento com Público)
    - cs (Segmentos de Clientes)
    - kr (Recursos Chave)
    - ch (Canais)
    - rev (Fontes de Receita)
    - costs (Estrutura de Custos)

    Retorne APENAS um JSON puro com essas chaves. Sem explicações ou Markdown.
  `;

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
  const apiKey = process.env.API_KEY;
  if (!apiKey) return {};

  const ai = new GoogleGenAI({ apiKey });
  
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

  const prompt = `
    Aja como um Especialista em Proposta de Valor e Design de Experiência. 
    Sua missão é preencher o "Mapa de Experiência e Valor" com base no contexto.
    
    Contexto: ${contextInfo}

    Preencha estes 6 campos (textos curtos e impactantes):
    - jobs (Tarefas a Executar): O que o cliente está tentando realizar.
    - pains (Dores Críticas): Frustrações e medos do cliente.
    - gains (Ganhos Desejados): O que o cliente espera ganhar.
    - products (Produto/Serviço): Como nossa solução se materializa.
    - relievers (Analgésicos AI): Como a IA alivia as dores citadas.
    - creators (Criadores de Encanto): Como geramos valor extra e encanto.

    Retorne APENAS um JSON puro com essas chaves.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: "application/json" }
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
  artifactName: string,
  currentContent: Record<string, string>
): Promise<Record<string, string>> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return currentContent;

  const ai = new GoogleGenAI({ apiKey });
  const prompt = `
    Aja como o Arquiteto Chefe do Impact Flow. Analise os seguintes inputs:
    Desafio: ${currentContent.challenge || 'Não definido'}
    Público: ${currentContent.audience || 'Não definido'}
    Ativos: ${currentContent.assets || 'Não definido'}

    Sua tarefa é preencher o Canvas Estratégico com uma solução proposta real.
    Campos a preencher no JSON de retorno:
    - ai_solution: Crie uma arquitetura de IA inovadora que resolve o desafio usando os ativos disponíveis.
    - legacy_path: Descreva como isso seria feito de forma lenta ou manual hoje.
    - success_metrics: Defina 2-3 KPIs claros.
    - implementation: Liste 3 passos práticos para o MVP.
    - challenge: Refine o texto do desafio para torná-lo mais profissional se necessário.
    - audience: Refine a descrição do público alvo.

    Retorne APENAS um JSON puro com essas chaves. Não inclua Markdown ou explicações.
  `;

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
    return currentContent;
  }
}
