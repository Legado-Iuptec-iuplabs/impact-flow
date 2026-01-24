export const promptTemplates = {
  fieldSuggestion: (
    fieldTitle: string,
    fieldDescription: string,
    context: string,
    artifactName: string
  ) => `
    Você é um Arquiteto de Estratégia e IA Sênior do Impact Flow.
    Documento: "${artifactName}".
    Campo: "${fieldTitle}" (${fieldDescription}).
    Contexto Atual:
    ${context || "Iniciando agora."}

    Sua missão: Propor um texto altamente estratégico, curto e inovador.
    Responda APENAS com a sugestão, sem introduções.
  `,

  bmgGeneration: (contextInfo: string) => `
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
  `,

  valueMapGeneration: (contextInfo: string) => `
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
  `,

  documentRefinement: (currentContent: Record<string, string>) => `
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
  `
};