
export type ArtifactType = 'IMPACT_FLOW' | 'BMG_PRO' | 'VALUE_EXP' | 'USER_JOURNEY_AI';

export interface CanvasField {
  id: string;
  title: string;
  placeholder: string;
  description: string;
  number?: string;
  colSpan?: number; 
  rowSpan?: number;
}

export interface ArtifactSchema {
  id: ArtifactType;
  name: string;
  fields: CanvasField[];
  gridCols: number;
}

export interface ProjectData {
  name: string;
  author: string;
  email: string;
  artifactType: ArtifactType;
  content: Record<string, string>;
}
