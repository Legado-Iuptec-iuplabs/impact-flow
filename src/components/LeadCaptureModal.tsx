import React, { useState } from 'react'
import { saveLead } from '@/services/supabaseService'

interface Props {
  problemInput: string
  onComplete: () => void
}

export const LeadCaptureModal: React.FC<Props> = ({ problemInput, onComplete }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    // Validação básica
    if (!name.trim()) {
      setError('Por favor, informe seu nome.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Por favor, informe um email válido.')
      return
    }

    setLoading(true)
    setError('')

    const result = await saveLead({
      name,
      email,
      phone,
      company,
      problem_input: problemInput
    })

    setLoading(false)

    if (result.success) {
      onComplete() // Fecha o modal e continua para o canvas
    } else {
      setError('Erro ao salvar. Tente novamente.')
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#121820] border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl">

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Quase lá!
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Deixe seus dados para receber o canvas por email
            e ter acesso ilimitado ao Impact Flow.
          </p>
        </div>

        {/* Formulário */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Seu nome completo *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#0A0F14] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF] transition-colors"
          />

          <input
            type="email"
            placeholder="Seu melhor email *"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#0A0F14] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF] transition-colors"
          />

          <input
            type="tel"
            placeholder="WhatsApp (opcional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#0A0F14] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF] transition-colors"
          />

          <input
            type="text"
            placeholder="Empresa (opcional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 bg-[#0A0F14] border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#2DD4BF] transition-colors"
          />

          {/* Mensagem de erro */}
          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          {/* Botão principal */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 mt-2 bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#0A0F14] font-bold rounded-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? 'Salvando...' : 'Gerar Meu Canvas Agora 🚀'}
          </button>

          <p className="text-xs text-slate-600 text-center pt-1">
            Seus dados são protegidos. Sem spam, prometido.
          </p>
        </div>

      </div>
    </div>
  )
}
