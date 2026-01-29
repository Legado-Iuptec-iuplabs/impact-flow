/// <reference types="vite/client" />

/**
 * Definições de tipos para variáveis de ambiente do Vite
 * Este arquivo é ESSENCIAL para TypeScript reconhecer import.meta.env no services/geminiService.ts
 * 
 * @see https://vitejs.dev/guide/env-and-mode.html
 */

interface ImportMetaEnv {
  /**
   * API Key para Google Gemini AI
   * Obtenha em: https://aistudio.google.com/app/apikey
   * 
   * @example 'AIzaSyCUdWbtL66rRnHW3UhRtPjENK12n0brHTs'
   */
  readonly VITE_GEMINI_API_KEY: string;

  /**
   * URL base da API (opcional, para desenvolvimento)
   */
  readonly VITE_API_BASE_URL?: string;

  /**
   * Modo de desenvolvimento
   * @default 'development'
   */
  readonly MODE: 'development' | 'production' | 'test';

  /**
   * Ambiente de deploy
   * @example 'vercel', 'netlify', 'aws'
   */
  readonly VITE_DEPLOY_ENV?: string;

  /**
   * Versão da aplicação
   */
  readonly VITE_APP_VERSION?: string;

  /**
   * Debug mode
   */
  readonly VITE_DEBUG_MODE?: string;
}

interface ImportMeta {
  /**
   * Metadados do ambiente Vite
   */
  readonly env: ImportMetaEnv;
}