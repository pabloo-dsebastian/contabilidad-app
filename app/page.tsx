'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Movimiento = {
  id: number
  tipo: 'venta' | 'gasto'
  descripcion: string
  cantidad: number
  fecha: string
  categoria: string
}

const CATEGORIAS_VENTA = ['General', 'Producto', 'Servicio', 'Otro']
const CATEGORIAS_GASTO = ['General', 'Material', 'Transporte', 'Comida', 'Otro']

export default function Home() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [tipo, setTipo] = useState<'venta' | 'gasto'>('venta')
  const [descripcion, setDescripcion] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [categoria, setCategoria] = useState('General')
  const [usuario, setUsuario] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [periodo, setPeriodo] = useState<'todo' | 'mes' | 'semana'>('todo')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/login'
      } else {
        setUsuario(data.user.email ?? null)
        const guardados = localStorage.getItem('movimientos_' + data.user.id)
        if (guardados) setMovimientos(JSON.parse(guardados))
        setCargando(false)
      }
    })
  }, [])

  const cerrarSesion = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const agregar = async () => {
    if (!cantidad || !descripcion) return
    const { data } = await supabase.auth.getUser()
    const nuevo: Movimiento = {
      id: Date.now(),
      tipo,
      descripcion,
      cantidad: parseFloat(cantidad),
      fecha: new Date().toLocaleDateString('es-ES'),
      categoria,
    }
    const actualizados = [nuevo, ...movimientos]
    setMovimientos(actualizados)
    if (data.user) {
      localStorage.setItem('movimientos_' + data.user.id, JSON.stringify(actualizados))
    }
    setDescripcion('')
    setCantidad('')
    setCategoria('General')
  }

  const borrar = async (id: number) => {
    const { data } = await supabase.auth.getUser()
    const actualizados = movimientos.filter(m => m.id !== id)
    setMovimientos(actualizados)
    if (data.user) {
      localStorage.setItem('movimientos_' + data.user.id, JSON.stringify(actualizados))
    }
  }

  const filtrados = movimientos.filter(m => {
    if (periodo === 'todo') return true
    const fecha = new Date(m.fecha.split('/').reverse().join('-'))
    const hoy = new Date()
    if (periodo === 'mes') {
      return fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()
    }
    if (periodo === 'semana') {
      const diff = (hoy.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24)
      return diff <= 7
    }
    return true
  })

  const totalVentas = filtrados.filter(m => m.tipo === 'venta').reduce((a, m) => a + m.cantidad, 0)
  const totalGastos = filtrados.filter(m => m.tipo === 'gasto').reduce((a, m) => a + m.cantidad, 0)
  const balance = totalVentas - totalGastos

  if (cargando) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-6 max-w-md mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Contto</h1>
          <p className="text-gray-400 text-xs mt-0.5">{usuario}</p>
        </div>
        <button onClick={cerrarSesion} className="text-xs text-gray-500 hover:text-gray-300">Salir</button>
      </div>

      {/* Periodo */}
      <div className="flex gap-2 mb-5">
        {(['todo', 'mes', 'semana'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all ${periodo === p ? 'bg-white text-gray-900' : 'bg-gray-700 text-gray-400'}`}
          >
            {p === 'todo' ? 'Todo' : p === 'mes' ? 'Este mes' : 'Esta semana'}
          </button>
        ))}
      </div>

      {/* Balance principal */}
      <div className="bg-gray-700 rounded-2xl p-5 mb-4 text-center">
        <p className="text-gray-400 text-xs mb-1">Balance</p>
        <p className={`text-4xl font-bold ${balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {balance >= 0 ? '+' : ''}{balance.toFixed(2)}€
        </p>
      </div>

      {/* Ventas y Gastos */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
          <p className="text-green-400 text-xs mb-1">↑ Ventas</p>
          <p className="text-xl font-bold text-green-400">{totalVentas.toFixed(2)}€</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 text-center">
          <p className="text-red-400 text-xs mb-1">↓ Gastos</p>
          <p className="text-xl font-bold text-red-400">{totalGastos.toFixed(2)}€</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-gray-700 rounded-2xl p-4 mb-5">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => { setTipo('venta'); setCategoria('General') }}
            className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all ${tipo === 'venta' ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-400'}`}
          >
            + Venta
          </button>
          <button
            onClick={() => { setTipo('gasto'); setCategoria('General') }}
            className={`flex-1 py-2 rounded-xl font-medium text-sm transition-all ${tipo === 'gasto' ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-400'}`}
          >
            − Gasto
          </button>
        </div>
        <select
          className="w-full bg-gray-600 text-white border-0 rounded-xl p-2.5 mb-2 text-sm"
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
        >
          {(tipo === 'venta' ? CATEGORIAS_VENTA : CATEGORIAS_GASTO).map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          className="w-full bg-gray-600 text-white placeholder-gray-400 border-0 rounded-xl p-2.5 mb-2 text-sm"
          placeholder="Descripción"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <input
          className="w-full bg-gray-600 text-white placeholder-gray-400 border-0 rounded-xl p-2.5 mb-3 text-sm"
          placeholder="Cantidad en €"
          type="number"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
        />
        <button
          onClick={agregar}
          className={`w-full py-2.5 rounded-xl font-medium text-sm text-white ${tipo === 'venta' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          Registrar {tipo === 'venta' ? 'venta' : 'gasto'}
        </button>
      </div>

      {/* Lista */}
      <div className="space-y-2">
        {filtrados.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-6">Aún no hay movimientos</p>
        )}
        {filtrados.map(m => (
          <div key={m.id} className="bg-gray-700 rounded-2xl p-3.5 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${m.tipo === 'venta' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {m.tipo === 'venta' ? '↑' : '↓'}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{m.descripcion}</p>
                <p className="text-xs text-gray-500">{m.categoria} · {m.fecha}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className={`font-bold text-sm ${m.tipo === 'venta' ? 'text-green-400' : 'text-red-400'}`}>
                {m.tipo === 'venta' ? '+' : '-'}{m.cantidad.toFixed(2)}€
              </p>
              <button onClick={() => borrar(m.id)} className="text-gray-600 hover:text-red-400 text-sm">✕</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
