
import { ArtifactSchema } from './types';

export const ARTIFACT_SCHEMAS: Record<string, ArtifactSchema> = {
  IMPACT_FLOW: {
    id: 'IMPACT_FLOW',
    name: 'Impact Flow Canvas',
    gridCols: 12,
    fields: [
      { id: 'challenge', title: '1. Ponto de Partida', number: '1', placeholder: 'Qual a dor, desafio ou experiência desejada?', description: 'Defina o problema central que a IA deve resolver.', colSpan: 6 },
      { id: 'audience', title: '2. Público Alvo', number: '2', placeholder: 'Quem é impactado?', description: 'Segmentos ou personas que receberão a solução.', colSpan: 3 },
      { id: 'assets', title: '3. Ativos Atuais', number: '3', placeholder: 'O que já temos? (Dados, ferramentas...)', description: 'Bases de dados, sistemas ou resources disponíveis.', colSpan: 3 },
      { id: 'legacy_path', title: '4. Fluxo Tradicional', number: '4', placeholder: 'Como é feito hoje sem IA?', description: 'O processo analógico ou paliativo atual.', colSpan: 4 },
      { id: 'ai_solution', title: '5. Solução Impact Flow (IA)', number: '★', placeholder: 'Aguardando arquitetura...', description: 'A solução proposta pela IA: agentes, modelos e automações.', colSpan: 8 },
      { id: 'success_metrics', title: '6. Visão de Sucesso', number: '5', placeholder: 'Resultados esperados...', description: 'KPIs e métricas que validam a solução.', colSpan: 4 },
      { id: 'implementation', title: '7. Próximos Passos', number: '6', placeholder: 'Como começar?', description: 'Roteiro simplificado para o MVP.', colSpan: 8 },
    ]
  },
  BMG_PRO: {
    id: 'BMG_PRO',
    name: 'Business Model Canvas (BMG)',
    gridCols: 10,
    fields: [
      { id: 'kp', title: 'Parceiros Chave', placeholder: 'Quem nos ajuda?', description: 'Alianças estratégicas.', colSpan: 2, rowSpan: 2 },
      { id: 'ka', title: 'Atividades Chave', placeholder: 'O que fazemos?', description: 'Ações essenciais.', colSpan: 2, rowSpan: 1 },
      { id: 'vp', title: 'Proposta de Valor', placeholder: 'O diferencial...', description: 'Valor único entregue.', colSpan: 2, rowSpan: 2 },
      { id: 'cr', title: 'Relacionamento com Público', placeholder: 'Como interagimos?', description: 'Estratégia de contato.', colSpan: 2, rowSpan: 1 },
      { id: 'cs', title: 'Segmentos de Clientes', placeholder: 'Para quem?', description: 'Público alvo.', colSpan: 2, rowSpan: 2 },
      { id: 'kr', title: 'Recursos Chave', placeholder: 'O que precisamos?', description: 'Ativos essenciais.', colSpan: 2, rowSpan: 1 },
      { id: 'ch', title: 'Canais', placeholder: 'Distribuição...', description: 'Como entregamos.', colSpan: 2, rowSpan: 1 },
      { id: 'rev', title: 'Fontes de Receita', placeholder: 'Como faturamos?', description: 'Lado esquerdo (entrada).', colSpan: 5, rowSpan: 1 },
      { id: 'costs', title: 'Estrutura de Custos', placeholder: 'Onde gastamos?', description: 'Lado direito (saída).', colSpan: 5, rowSpan: 1 },
    ]
  },
  VALUE_EXP: {
    id: 'VALUE_EXP',
    name: 'Mapa de Experiência e Valor',
    gridCols: 6,
    fields: [
      { id: 'jobs', title: 'Tarefas a Executar', placeholder: 'O que o cliente quer realizar?', description: 'Necessidades funcionais e emocionais.', colSpan: 2 },
      { id: 'pains', title: 'Dores Críticas', placeholder: 'O que dói no cliente?', description: 'Frustrações e medos.', colSpan: 2 },
      { id: 'gains', title: 'Ganhos Desejados', placeholder: 'O que ele sonha?', description: 'Desejos e necessidades.', colSpan: 2 },
      { id: 'products', title: 'Produto/Serviço', placeholder: 'Nossa oferta principal...', description: 'O que compõe a solução.', colSpan: 2 },
      { id: 'relievers', title: 'Analgésicos AI', placeholder: 'Como a IA cura a dor?', description: 'Soluções imediatas.', colSpan: 2 },
      { id: 'creators', title: 'Criadores de Encanto', placeholder: 'Superando expectativas...', description: 'Diferenciais uau.', colSpan: 2 },
    ]
  }
};
