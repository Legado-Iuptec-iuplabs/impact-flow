import { useState, useCallback } from 'react';
import { getAISuggestion, generateBmgFull, generateValueMapFull, refineFullDocument } from '../services/geminiService';

export const useAISuggestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSuggestion = useCallback(async (
    fieldTitle: string,
    fieldDescription: string,
    allContext: Record<string, string>,
    artifactName: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      return await getAISuggestion(fieldTitle, fieldDescription, allContext, artifactName);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao gerar sugestão';
      setError(errorMsg);
      return `[Placeholder] ${fieldTitle}: Preencha manualmente.`;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateBMG = useCallback(async (
    source: 'idea' | 'impact_flow',
    inputData: string | Record<string, string>
  ) => {
    setLoading(true);
    setError(null);
    try {
      return await generateBmgFull(source, inputData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao gerar BMG';
      setError(errorMsg);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  const generateValueMap = useCallback(async (
    source: 'context' | 'impact_flow',
    inputData: string | Record<string, string>
  ) => {
    setLoading(true);
    setError(null);
    try {
      return await generateValueMapFull(source, inputData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao gerar Mapa de Valor';
      setError(errorMsg);
      return {};
    } finally {
      setLoading(false);
    }
  }, []);

  const refineDocument = useCallback(async (
    artifactName: string,
    currentContent: Record<string, string>
  ) => {
    setLoading(true);
    setError(null);
    try {
      return await refineFullDocument(artifactName, currentContent);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao refinar documento';
      setError(errorMsg);
      return currentContent;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getSuggestion,
    generateBMG,
    generateValueMap,
    refineDocument
  };
};