export const promptTemplates = {
  fieldSuggestion: (
    fieldTitle: string,
    fieldDescription: string,
    context: string,
    artifactName: string
  ) => `
Você é um Consultor Sênior de Estratégia e IA com 20 anos de experiência em transformação digital.

Documento em análise: "${artifactName}"
Campo a preencher: "${fieldTitle}"
Propósito do campo: ${fieldDescription}

Contexto do projeto:
${context || "Projeto em fase inicial — seja propositivo e estratégico."}

Escreva uma resposta direta, densa em conteúdo e acionável para o campo "${fieldTitle}".
- Seja específico e use linguagem executiva
- Máximo de 3 linhas
- NÃO inclua introduções, títulos ou explicações — apenas o conteúdo do campo
`,

  bmgGeneration: (contextInfo: string) => `
Você é um Especialista em Modelos de Negócio com expertise em IA aplicada ao contexto empresarial.

Contexto fornecido:
${contextInfo}

Com base nesse contexto, preencha o Business Model Canvas completo. Cada campo deve ser específico para o negócio descrito — evite respostas genéricas.

Retorne um JSON com exatamente estas chaves:
{
  "kp": "Parceiros estratégicos essenciais para operar e escalar",
  "ka": "Atividades centrais que geram e entregam valor",
  "vp": "Proposta de valor diferenciada — o que resolve e por que é único",
  "cr": "Como a empresa se relaciona e retém cada segmento de cliente",
  "cs": "Segmentos de clientes prioritários com características específicas",
  "kr": "Recursos críticos: tecnologia, dados, equipe, IP",
  "ch": "Canais de aquisição, entrega e pós-venda",
  "rev": "Fontes de receita com modelo de monetização",
  "costs": "Principais custos fixos e variáveis da operação"
}

Retorne APENAS o JSON. Sem Markdown, sem texto adicional.
`,

  valueMapGeneration: (contextInfo: string) => `
Você é um especialista em Design de Proposta de Valor (metodologia Osterwalder) com foco em soluções de IA.

Contexto:
${contextInfo}

Preencha o Mapa de Valor e Experiência do Cliente com profundidade real — cada campo deve refletir o contexto específico acima.

Retorne um JSON com exatamente estas chaves:
{
  "jobs": "O que o cliente precisa realizar — tarefas funcionais, sociais e emocionais",
  "pains": "Dores críticas: frustrações, riscos, obstáculos que impedem o progresso",
  "gains": "Resultados e benefícios desejados: o que define sucesso para o cliente",
  "products": "Como a solução se materializa — produto/serviço concreto com IA",
  "relievers": "Como a IA elimina ou reduz especificamente cada dor listada",
  "creators": "Como a solução gera ganhos além do esperado — encantamento e diferenciação"
}

Retorne APENAS o JSON. Sem Markdown, sem texto adicional.
`,

  documentRefinement: (currentContent: Record<string, string>) => `
Você é o Arquiteto Chefe de Estratégia de IA do Impact Flow. Sua missão é transformar inputs brutos em uma arquitetura estratégica de IA coerente e acionável.

Inputs do usuário:
- Desafio central: ${currentContent.challenge || 'Não definido'}
- Público-alvo: ${currentContent.audience || 'Não definido'}
- Ativos disponíveis: ${currentContent.assets || 'Não definido'}

Raciocine sobre o problema e produza uma solução estratégica real:

1. Qual é o problema central não resolvido?
2. Como a IA pode resolver isso de forma diferenciada?
3. Quais são os indicadores de sucesso mensuráveis?
4. Qual é o caminho de implementação mais rápido para validar?

Retorne um JSON com exatamente estas chaves:
{
  "challenge": "Versão refinada e profissional do desafio (se já estiver bom, mantenha próximo ao original)",
  "audience": "Descrição precisa do público-alvo com segmentação relevante",
  "ai_solution": "Arquitetura de IA detalhada: quais modelos/técnicas, como se integram, qual fluxo de dados, qual impacto direto no desafio",
  "legacy_path": "Como esse problema é resolvido hoje sem IA — processos manuais, tempo gasto, custo, limitações",
  "success_metrics": "3 KPIs específicos e mensuráveis com baseline e meta (ex: redução de X% em Y semanas)",
  "implementation": "3 fases práticas do MVP: O que construir primeiro, como validar, critério de avanço para próxima fase"
}

Retorne APENAS o JSON. Sem Markdown, sem texto adicional.
`
};