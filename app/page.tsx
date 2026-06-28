'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

type Movimiento = {
  id: number
  tipo: 'venta' | 'gasto'
  descripcion: string
  cantidad: number
  fecha: string
}

export default function Home() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [tipo, setTipo] = useState<'venta' | 'gasto'>('venta')
  const [descripcion, setDescripcion] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [usuario, setUsuario] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)

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
    }
    const actualizados = [nuevo, ...movimientos]
    setMovimientos(actualizados)
    if (data.user) {
      localStorage.setItem('movimientos_' + data.user.id, JSON.stringify(actualizados))
    }
    setDescripcion('')
    setCantidad('')
  }

  const totalVentas = movimientos.filter(m => m.tipo === 'venta').reduce((a, m) => a + m.cantidad, 0)
  const totalGastos = movimientos.filter(m => m.tipo === 'gasto').reduce((a, m) => a + m.cantidad, 0)
  const balance = totalVentas - totalGastos

  if (cargando) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Cargando...</div>
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Mi Contabilidad</h1>
        <button onClick={cerrarSesion} className="text-xs text-gray-400 underline">Salir</button>
      </div>
      <p className="text-gray-500 text-sm mb-6">{usuario}</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-100 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">Ventas</p>
          <p className="text-lg font-bold text-green-600">{totalVentas.toFixed(2)}€</p>
        </div>
        <div className="bg-red-100 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500">Gastos</p>
          <p className="text-lg font-bold text-red-500">{totalGastos.toFixed(2)}€</p>
        </div>
        <div className={`rounded-xl p-3 text-center ${balance >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
          <p className="text-xs text-gray-500">Balance</p>
          <p className={`text-lg font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-500'}`}>{balance.toFixed(2)}€</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setTipo('venta')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm ${tipo === 'venta' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            + Venta
          </button>
          <button
            onClick={() => setTipo('gasto')}
            className={`flex-1 py-2 rounded-lg font-medium text-sm ${tipo === 'gasto' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            - Gasto
          </button>
        </div>
        <input
          className="w-full border rounded-lg p-2 mb-2 text-sm"
          placeholder="Descripción (ej: venta de frutas)"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
        <input
          className="w-full border rounded-lg p-2 mb-3 text-sm"
          placeholder="Cantidad en €"
          type="number"
          value={cantidad}
          onChange={e => setCantidad(e.target.value)}
        />
        <button
          onClick={agregar}
          className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium text-sm"
        >
          Registrar
        </button>
      </div>

      <div className="space-y-2">
        {movimientos.length === 0 && (
          <p className="text-center text-gray-400 text-sm">Aún no hay movimientos</p>
        )}
        {movimientos.map(m => (
          <div key={m.id} className="bg-white rounded-xl p-3 shadow-sm flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{m.descripcion}</p>
              <p className="text-xs text-gray-400">{m.fecha}</p>
            </div>
            <p className={`font-bold ${m.tipo === 'venta' ? 'text-green-500' : 'text-red-500'}`}>
              {m.tipo === 'venta' ? '+' : '-'}{m.cantidad.toFixed(2)}€
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
