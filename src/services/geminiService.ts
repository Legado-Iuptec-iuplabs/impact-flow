import { GoogleGenAI } from "@google/genai";
import { promptTemplates } from '../utils/aiPromptTemplates';

const MODEL_PRO = 'gemini-2.5-pro';
const MODEL_FLASH = 'gemini-2.5-flash';

function getClient(): GoogleGenAI {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error('VITE_GEMINI_API_KEY não configurada.');
  return new GoogleGenAI({ apiKey });
}

function parseJsonResponse(text: string): Record<string, string> {
  // Tenta extrair JSON de dentro de blocos de código ou texto livre
  const match = text.match(/\{[\s\S]*\}/);
  const raw = match ? match[0] : text;
  try {
    return JSON.parse(raw);
  } catch {
    console.error('[Gemini] Falha ao parsear JSON. Resposta recebida:', text.slice(0, 300));
    return {};
  }
}

export async function getAISuggestion(
  fieldTitle: string,
  fieldDescription: string,
  allContext: Record<string, string>,
  artifactName: string
): Promise<string> {
  try {
    const ai = getClient();
    const contextString = Object.entries(allContext)
      .filter(([_, v]) => v && v.trim().length > 0)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');

    const prompt = promptTemplates.fieldSuggestion(fieldTitle, fieldDescription, contextString, artifactName);
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: { temperature: 0.8 }
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error('[Gemini] getAISuggestion falhou:', error);
    return `[IA indisponível] Preencha manualmente: ${fieldTitle}`;
  }
}

export async function generateBmgFull(
  source: 'idea' | 'impact_flow',
  inputData: string | Record<string, string>
): Promise<Record<string, string>> {
  try {
    const ai = getClient();

    let contextInfo = "";
    if (source === 'idea') {
      contextInfo = `Ideia Central do Negócio: ${inputData}`;
    } else {
      const ctx = inputData as Record<string, string>;
      contextInfo = `Impact Flow Canvas:
      - Desafio: ${ctx.challenge || 'Não definido'}
      - Público: ${ctx.audience || 'Não definido'}
      - Ativos: ${ctx.assets || 'Não definido'}
      - Solução IA: ${ctx.ai_solution || 'Não definida'}`;
    }

    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: promptTemplates.bmgGeneration(contextInfo),
      config: { responseMimeType: "application/json", temperature: 0.7 }
    });

    return parseJsonResponse(response.text || '{}');
  } catch (err) {
    console.error('[Gemini] generateBmgFull falhou:', err);
    return {};
  }
}

export async function generateValueMapFull(
  source: 'context' | 'impact_flow',
  inputData: string | Record<string, string>
): Promise<Record<string, string>> {
  try {
    const ai = getClient();

    let contextInfo = "";
    if (source === 'context') {
      contextInfo = `Contexto do Problema/Oportunidade: ${inputData}`;
    } else {
      const ctx = inputData as Record<string, string>;
      contextInfo = `Impact Flow Canvas:
      - Desafio: ${ctx.challenge || 'Não definido'}
      - Público: ${ctx.audience || 'Não definido'}
      - Solução IA: ${ctx.ai_solution || 'Não definida'}`;
    }

    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: promptTemplates.valueMapGeneration(contextInfo),
      config: { responseMimeType: "application/json", temperature: 0.7 }
    });

    return parseJsonResponse(response.text || '{}');
  } catch (err) {
    console.error('[Gemini] generateValueMapFull falhou:', err);
    return {};
  }
}

export async function refineFullDocument(
  _artifactName: string,
  currentContent: Record<string, string>
): Promise<Record<string, string>> {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: promptTemplates.documentRefinement(currentContent),
      config: { responseMimeType: "application/json", temperature: 0.8 }
    });

    return parseJsonResponse(response.text || '{}');
  } catch (err) {
    console.error('[Gemini] refineFullDocument falhou:', err);
    return currentContent;
  }
}