import type { ProjectData } from '../types';

export const downloadProject = (project: ProjectData) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
  const dl = document.createElement('a');
  dl.setAttribute("href", dataStr);
  dl.setAttribute("download", `iuptec_${project.name.toLowerCase().replace(/\s/g, '_')}_${Date.now()}.json`);
  dl.click();
  dl.remove();
};

export const printCanvas = () => {
  window.print();
};

export const formatFileName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 50);
};