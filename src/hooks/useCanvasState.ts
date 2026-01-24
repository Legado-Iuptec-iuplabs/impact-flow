import { useState, useCallback } from 'react';
import type { ProjectData, ArtifactType } from '../types';

export const useCanvasState = (initialProject?: Partial<ProjectData>) => {
  const [project, setProject] = useState<ProjectData>({
    name: 'Inovação Disruptiva',
    author: 'Equipe iuptec',
    email: 'hello@iuptec.com',
    artifactType: 'IMPACT_FLOW',
    content: {},
    ...initialProject
  });

  const handleFieldChange = useCallback((id: string, value: string) => {
    setProject(prev => ({
      ...prev,
      content: { ...prev.content, [id]: value }
    }));
  }, []);

  const updateProject = useCallback((updates: Partial<ProjectData>) => {
    setProject(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    project,
    setProject,
    handleFieldChange,
    updateProject
  };
};