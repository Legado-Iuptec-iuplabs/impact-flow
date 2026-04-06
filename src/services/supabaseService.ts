import { createClient } from '@supabase/supabase-js'

// ⬇️ SUBSTITUA pelos seus valores do Supabase (Etapa 1, Passo 5)
const SUPABASE_URL = 'https://xcczgrudvdbpkitvfquy.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjY3pncnVkdmRicGtpdHZmcXV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU1MDcxNTMsImV4cCI6MjA5MTA4MzE1M30.2fm2oNA-3qfQmBtTv1TLsuMQQTlwgT1u4udToCA6Rzo'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

export interface LeadData {
  name: string
  email: string
  phone?: string
  company?: string
  problem_input: string
}

export async function saveLead(data: LeadData): Promise<{ success: boolean; error?: string }> {
  try {
    // Calcular score automático
    let score = 0

    if (data.email && !data.email.includes('@gmail') && !data.email.includes('@hotmail')) {
      score += 10 // Email corporativo
    }
    if (data.phone) score += 10
    if (data.company) score += 15
    if (data.problem_input.length > 200) score += 10
    if (data.problem_input.toLowerCase().includes('r$') ||
        data.problem_input.toLowerCase().includes('faturamento')) {
      score += 20
    }
    if (data.problem_input.toLowerCase().includes('urgente') ||
        data.problem_input.toLowerCase().includes('travou')) {
      score += 15
    }

    const tier = score > 80 ? 'hot' : score > 50 ? 'warm' : 'cold'

    const { error } = await supabase.from('leads').insert([{
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      problem_input: data.problem_input,
      score,
      tier,
      source: 'impact-flow',
      status: 'new'
    }])

    if (error) {
      // Email duplicado — deixa passar sem travar o usuário
      if (error.code === '23505') return { success: true }
      return { success: false, error: error.message }
    }

    return { success: true }

  } catch (err) {
    console.error('Erro ao salvar lead:', err)
    return { success: false, error: 'Erro inesperado' }
  }
}
