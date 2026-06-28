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
      else window.location.href = '/'
    }
    setCargando(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-sm p-6 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1">Mi Contabilidad</h1>
        <p className="text-center text-gray-500 text-sm mb-6">
          {modo === 'login' ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta gratis'}
        </p>

        <input
          className="w-full border rounded-lg p-2 mb-3 text-sm"
          placeholder="Tu email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-2 mb-4 text-sm"
          placeholder="Tu contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {mensaje && (
          <p className="text-sm text-center mb-3 text-blue-600">{mensaje}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={cargando}
          className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium text-sm mb-3"
        >
          {cargando ? 'Cargando...' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>

        <p className="text-center text-sm text-gray-500">
          {modo === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            onClick={() => setModo(modo === 'login' ? 'registro' : 'login')}
            className="text-gray-900 font-medium underline"
          >
            {modo === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </div>
    </main>
  )
}
