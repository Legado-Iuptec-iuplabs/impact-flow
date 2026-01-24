export type ArtifactType = 'IMPACT_FLOW' | 'BMG_PRO' | 'VALUE_EXP';

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

export interface CanvasBoxProps {
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