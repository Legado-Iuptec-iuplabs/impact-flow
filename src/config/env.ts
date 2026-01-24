/**
 * Configurações de ambiente
 * Lógica de fallback e validação
 */

export const config = {
  /**
   * Retorna a API Key do Gemini com validação
   * @throws {Error} Se a chave não estiver configurada
   */
  get geminiApiKey(): string {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!key || key.trim() === '') {
      throw new Error(
        'VITE_GEMINI_API_KEY não configurada. ' +
        'Configure no .env.local - Obtenha em: https://aistudio.google.com/app/apikey'
      );
    }
    
    // Valida formato básico (começa com AIza)
    if (!key.startsWith('AIza')) {
      console.warn('A API Key pode estar em formato inválido');
    }
    
    return key;
  },

  /**
   * Ambiente atual
   */
  get env(): ImportMetaEnv['MODE'] {
    return import.meta.env.MODE;
  },

  /**
   * Ambiente desenvolvimento
   */
  get isDev(): boolean {
    return this.env === 'development';
  },

  /**
   * Ambiente produção
   */
  get isProd(): boolean {
    return this.env === 'production';
  },

  /**
   * URL base da API (com fallback)
   */
  get apiBaseUrl(): string {
    return import.meta.env.VITE_API_BASE_URL || 
           (this.isProd ? 'https://api.producao.com' : 'http://localhost:3000');
  },

  /**
   * Logs
   */
  get debugMode(): boolean {
    return import.meta.env.VITE_DEBUG_MODE === 'true';
  }
} as const;