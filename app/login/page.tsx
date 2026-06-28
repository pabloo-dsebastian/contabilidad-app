'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [modo, setModo] = useState<'login' | 'registro'>('login')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) return
    setCargando(true)
    setMensaje('')

    if (modo === 'registro') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMensaje(error.message)
      else setMensaje('Revisa tu email para confirmar la cuenta')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMensaje('Email o contraseña incorrectos')
      else window.location.href = '/dashboard'
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-1 text-white">Contto</h1>
        <p className="text-center text-gray-400 text-sm mb-6">
          {modo === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta gratis'}
        </p>

        <input
          className="w-full bg-gray-700 text-white placeholder-gray-400 border-0 rounded-xl p-3 mb-3 text-sm"
          placeholder="Tu email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full bg-gray-700 text-white placeholder-gray-400 border-0 rounded-xl p-3 mb-4 text-sm"
          placeholder="Tu contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {mensaje && (
          <p className="text-sm text-center mb-3 text-blue-400">{mensaje}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={cargando}
          className="w-full bg-green-500 hover:bg-green-400 text-white py-3 rounded-xl font-medium text-sm mb-3 transition-all"
        >
          {cargando ? 'Cargando...' : modo === 'login' ? 'Entrar' : 'Crear cuenta gratis'}
        </button>

        <p className="text-center text-sm text-gray-500">
          {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
            className="text-green-400 font-medium"
          >
            {modo === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </main>
  )
}
