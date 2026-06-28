'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'

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

const CAT_ICONS: Record<string, string> = {
  General: '◈', Producto: '◉', Servicio: '◎', Otro: '○',
  Material: '◆', Transporte: '▶', Comida: '◐',
}

const CAT_COLORS: Record<string, string> = {
  General: '#6366f1', Producto: '#8b5cf6', Servicio: '#06b6d4', Otro: '#64748b',
  Material: '#f59e0b', Transporte: '#3b82f6', Comida: '#ec4899',
}

function formatEuro(n: number) {
  return new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
}

export default function Dashboard() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([])
  const [tipo, setTipo] = useState<'venta' | 'gasto'>('venta')
  const [descripcion, setDescripcion] = useState('')
  const [cantidad, setCantidad] = useState('')
  const [categoria, setCategoria] = useState('General')
  const [usuario, setUsuario] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [cargando, setCargando] = useState(true)
  const [periodo, setPeriodo] = useState<'semana' | 'mes' | 'todo'>('mes')
  const [modal, setModal] = useState(false)
  const [tab, setTab] = useState<'overview' | 'transacciones' | 'analisis'>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { window.location.href = '/login'; return }
      setUsuario(data.user.email ?? null)
      setUserId(data.user.id)
      const g = localStorage.getItem('movimientos_' + data.user.id)
      if (g) setMovimientos(JSON.parse(g))
      setCargando(false)
    })
  }, [])

  const save = (list: Movimiento[]) => {
    setMovimientos(list)
    if (userId) localStorage.setItem('movimientos_' + userId, JSON.stringify(list))
  }

  const agregar = () => {
    if (!cantidad || !descripcion) return
    const nuevo: Movimiento = {
      id: Date.now(), tipo, descripcion,
      cantidad: parseFloat(cantidad),
      fecha: new Date().toLocaleDateString('es-ES'), categoria,
    }
    save([nuevo, ...movimientos])
    setDescripcion(''); setCantidad(''); setCategoria('General'); setModal(false)
  }

  const borrar = (id: number) => save(movimientos.filter(m => m.id !== id))

  const cerrarSesion = async () => { await supabase.auth.signOut(); window.location.href = '/login' }

  const filtrados = movimientos.filter(m => {
    if (periodo === 'todo') return true
    const p = m.fecha.split('/')
    const f = new Date(+p[2], +p[1]-1, +p[0])
    const h = new Date()
    if (periodo === 'mes') return f.getMonth() === h.getMonth() && f.getFullYear() === h.getFullYear()
    return (h.getTime() - f.getTime()) / 86400000 <= 7
  })

  const ventas = filtrados.filter(m => m.tipo === 'venta')
  const gastos = filtrados.filter(m => m.tipo === 'gasto')
  const totalV = ventas.reduce((a, m) => a + m.cantidad, 0)
  const totalG = gastos.reduce((a, m) => a + m.cantidad, 0)
  const balance = totalV - totalG
  const margen = totalV > 0 ? ((balance / totalV) * 100) : 0
  const ticketMedio = ventas.length > 0 ? totalV / ventas.length : 0

  const grafica = (() => {
    const map: Record<string, { d: string, v: number, g: number }> = {}
    filtrados.forEach(m => {
      if (!map[m.fecha]) map[m.fecha] = { d: m.fecha, v: 0, g: 0 }
      if (m.tipo === 'venta') map[m.fecha].v += m.cantidad
      else map[m.fecha].g += m.cantidad
    })
    return Object.values(map).sort((a, b) => {
      const pa = a.d.split('/'), pb = b.d.split('/')
      return new Date(+pa[2],+pa[1]-1,+pa[0]).getTime() - new Date(+pb[2],+pb[1]-1,+pb[0]).getTime()
    })
  })()

  const bycat = (tipo: string) => filtrados.filter(m => m.tipo === tipo).reduce((acc, m) => {
    acc[m.categoria] = (acc[m.categoria] || 0) + m.cantidad; return acc
  }, {} as Record<string, number>)

  const nombre = usuario?.split('@')[0] || 'tú'
  const hora = new Date().getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 20 ? 'Buenas tardes' : 'Buenas noches'

  if (cargando) return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center">
      <div className="space-y-4 text-center">
        <div className="w-12 h-12 border border-green-500/30 border-t-green-400 rounded-full animate-spin mx-auto" />
        <p className="text-gray-700 text-sm tracking-wider uppercase">Cargando</p>
      </div>
    </div>
  )

  const NavItem = ({ id, label, icon }: { id: string, label: string, icon: string }) => (
    <button onClick={() => { setTab(id as any); setSidebarOpen(false) }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all text-left group ${tab === id ? 'bg-white/[0.05] text-white' : 'text-gray-700 hover:text-gray-300'}`}>
      <span className={`text-base font-mono ${tab === id ? 'text-green-400' : 'text-gray-700 group-hover:text-gray-500'}`}>{icon}</span>
      <span className="font-medium">{label}</span>
      {id === 'transacciones' && filtrados.length > 0 && (
        <span className="ml-auto text-[10px] font-bold bg-white/[0.06] text-gray-500 px-2 py-0.5 rounded-full">{filtrados.length}</span>
      )}
    </button>
  )

  return (
    <div className="min-h-screen bg-[#030303] text-white flex overflow-hidden">

      {/* ═══ SIDEBAR ═══ */}
      <>
        {/* Overlay móvil */}
        {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)} />}

        <aside className={`fixed top-0 left-0 bottom-0 w-64 bg-[#080808] border-r border-white/[0.04] z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

          {/* Logo */}
          <div className="px-6 py-7 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img src="/logo.png" alt="Contto" className="w-8 h-8 object-contain" />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[#080808]" />
              </div>
              <div>
                <p className="text-base font-black tracking-tight">Contto</p>
                <p className="text-[10px] text-gray-700 -mt-0.5">Panel financiero</p>
              </div>
            </div>
          </div>

          {/* Periodo rápido */}
          <div className="px-4 mb-4">
            <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-1 flex">
              {(['semana', 'mes', 'todo'] as const).map(p => (
                <button key={p} onClick={() => setPeriodo(p)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-lg transition-all ${periodo === p ? 'bg-white/10 text-white' : 'text-gray-700 hover:text-gray-500'}`}>
                  {p === 'todo' ? 'Todo' : p === 'mes' ? 'Mes' : 'Semana'}
                </button>
              ))}
            </div>
          </div>

          {/* Mini balance en sidebar */}
          <div className="mx-4 mb-6 bg-gradient-to-br from-green-500/[0.08] to-transparent border border-green-500/[0.1] rounded-2xl p-4">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-2">Balance actual</p>
            <p className={`text-2xl font-black ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
              {balance >= 0 ? '+' : ''}{formatEuro(balance)}€
            </p>
            <div className="mt-3 h-px bg-white/[0.05]" />
            <div className="mt-3 flex justify-between text-[11px]">
              <span className="text-green-400">↑ {formatEuro(totalV)}€</span>
              <span className="text-red-400">↓ {formatEuro(totalG)}€</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="px-3 space-y-0.5 flex-1">
            <p className="px-4 text-[10px] font-bold text-gray-800 uppercase tracking-[0.2em] mb-2">Panel</p>
            <NavItem id="overview" label="Resumen" icon="▦" />
            <NavItem id="transacciones" label="Transacciones" icon="↕" />
            <NavItem id="analisis" label="Análisis" icon="◈" />
          </nav>

          {/* Botón añadir */}
          <div className="px-4 pb-4">
            <button onClick={() => setModal(true)}
              className="w-full bg-green-500 hover:bg-green-400 text-black font-black py-3 rounded-xl text-sm transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/30">
              + Nuevo movimiento
            </button>
          </div>

          {/* User */}
          <div className="border-t border-white/[0.04] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-sm font-black text-black flex-shrink-0">
                {nombre[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{nombre}</p>
                <p className="text-[10px] text-gray-700 truncate">{usuario}</p>
              </div>
              <button onClick={cerrarSesion} className="text-gray-700 hover:text-red-400 transition-colors text-xs" title="Salir">⏻</button>
            </div>
          </div>
        </aside>
      </>

      {/* ═══ MAIN ═══ */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="sticky top-0 z-20 bg-[#030303]/90 backdrop-blur-2xl border-b border-white/[0.04] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white">
              ☰
            </button>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-white">{saludo}, <span className="text-green-400">{nombre}</span></p>
              <p className="text-xs text-gray-700 capitalize">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
          </div>

          {/* Tabs desktop */}
          <div className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] rounded-xl p-1">
            {[{ id: 'overview', l: 'Resumen' }, { id: 'transacciones', l: 'Transacciones' }, { id: 'analisis', l: 'Análisis' }].map(t => (
              <button key={t.id} onClick={() => setTab(t.id as any)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === t.id ? 'bg-white/10 text-white' : 'text-gray-600 hover:text-white'}`}>
                {t.l}
              </button>
            ))}
          </div>

          <button onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black px-5 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-green-500/20">
            <span className="text-lg leading-none">+</span>
            <span className="hidden sm:inline">Añadir</span>
          </button>
        </header>

        {/* Tabs móvil */}
        <div className="lg:hidden flex border-b border-white/[0.04] bg-[#030303]">
          {[{ id: 'overview', l: 'Inicio' }, { id: 'transacciones', l: 'Movimientos' }, { id: 'analisis', l: 'Análisis' }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id as any)}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 ${tab === t.id ? 'text-white border-green-400' : 'text-gray-700 border-transparent'}`}>
              {t.l}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 lg:p-8 space-y-5 max-w-6xl w-full mx-auto">

          {/* ───── OVERVIEW ───── */}
          {tab === 'overview' && (
            <>
              {/* Hero balance */}
              <div className="relative rounded-3xl overflow-hidden bg-[#080808] border border-white/[0.05] p-8">
                {/* Decoración */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/[0.04] rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
                  <div className="absolute bottom-0 left-20 w-60 h-60 bg-emerald-400/[0.03] rounded-full blur-3xl" />
                  {/* Grid sutil */}
                  <div className="absolute inset-0 opacity-[0.02]" style={{backgroundImage:'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',backgroundSize:'40px 40px'}} />
                </div>

                <div className="relative">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <p className="text-[11px] font-bold text-gray-700 uppercase tracking-[0.25em] mb-3">
                        {periodo === 'mes' ? 'Balance del mes' : periodo === 'semana' ? 'Balance de la semana' : 'Balance total'}
                      </p>
                      <div className="flex items-end gap-3">
                        <p className={`text-5xl lg:text-6xl font-black tracking-tighter ${balance >= 0 ? 'text-white' : 'text-red-400'}`}>
                          {balance >= 0 ? '+' : ''}{formatEuro(balance)}
                        </p>
                        <p className="text-2xl text-gray-700 mb-1 font-bold">€</p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl text-sm font-black border ${margen >= 0 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                      {margen >= 0 ? '↑' : '↓'} {Math.abs(margen).toFixed(1)}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Ingresos', val: formatEuro(totalV) + '€', color: 'text-green-400', sub: `${ventas.length} transacciones` },
                      { label: 'Gastos', val: formatEuro(totalG) + '€', color: 'text-red-400', sub: `${gastos.length} transacciones` },
                      { label: 'Ticket medio', val: formatEuro(ticketMedio) + '€', color: 'text-white', sub: 'por ingreso' },
                      { label: 'Margen neto', val: margen.toFixed(1) + '%', color: margen >= 0 ? 'text-green-400' : 'text-red-400', sub: 'del total' },
                    ].map(s => (
                      <div key={s.label} className="bg-white/[0.03] border border-white/[0.05] rounded-2xl px-4 py-3">
                        <p className="text-[10px] text-gray-700 uppercase tracking-wider mb-1.5">{s.label}</p>
                        <p className={`text-lg font-black ${s.color}`}>{s.val}</p>
                        <p className="text-[10px] text-gray-700 mt-0.5">{s.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Gráfica + últimos */}
              <div className="grid lg:grid-cols-5 gap-5">

                {/* Gráfica */}
                <div className="lg:col-span-3 bg-[#080808] border border-white/[0.05] rounded-2xl p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm font-bold text-white">Evolución financiera</p>
                      <p className="text-[11px] text-gray-700 mt-0.5">Ingresos y gastos diarios</p>
                    </div>
                    <div className="flex gap-3 text-[11px] text-gray-600">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full inline-block"/></span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 bg-red-500/70 rounded-full inline-block"/></span>
                    </div>
                  </div>
                  {grafica.length > 0 ? (
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={grafica} margin={{top:0,right:0,left:-28,bottom:0}} barGap={2} barCategoryGap="30%">
                        <CartesianGrid strokeDasharray="1 1" stroke="#ffffff03" vertical={false}/>
                        <XAxis dataKey="d" tick={{fill:'#2d2d2d',fontSize:10}} tickLine={false} axisLine={false}/>
                        <YAxis tick={{fill:'#2d2d2d',fontSize:10}} tickLine={false} axisLine={false}/>
                        <Tooltip cursor={{fill:'rgba(255,255,255,0.015)'}}
                          contentStyle={{backgroundColor:'#080808',border:'1px solid #111',borderRadius:'12px',color:'#fff',fontSize:'12px',padding:'10px 14px'}}
                          formatter={(v:number,n:string)=>[`${formatEuro(v)}€`,n==='v'?'Ingresos':'Gastos']}/>
                        <Bar dataKey="v" fill="#22c55e" radius={[3,3,0,0]} maxBarSize={24}/>
                        <Bar dataKey="g" fill="#ef444460" radius={[3,3,0,0]} maxBarSize={24}/>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[180px] flex flex-col items-center justify-center gap-3 border border-dashed border-white/[0.04] rounded-xl">
                      <p className="text-gray-700 text-xs">Sin datos aún</p>
                      <button onClick={()=>setModal(true)} className="text-green-400 text-xs hover:underline">+ Primer movimiento</button>
                    </div>
                  )}
                </div>

                {/* Últimos movimientos */}
                <div className="lg:col-span-2 bg-[#080808] border border-white/[0.05] rounded-2xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/[0.04] flex justify-between items-center">
                    <p className="text-sm font-bold">Recientes</p>
                    <button onClick={()=>setTab('transacciones')} className="text-[11px] text-gray-700 hover:text-green-400 transition-colors">Ver todos</button>
                  </div>
                  {filtrados.slice(0,6).length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-gray-700 text-xs">Sin movimientos</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-white/[0.03]">
                      {filtrados.slice(0,6).map(m => (
                        <div key={m.id} className="group flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0 ${m.tipo==='venta'?'bg-green-500/10 text-green-400':'bg-red-500/10 text-red-400'}`}
                            style={m.tipo==='gasto'?{color:CAT_COLORS[m.categoria]}:{}}>
                            {CAT_ICONS[m.categoria]||'○'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{m.descripcion}</p>
                            <p className="text-[10px] text-gray-700">{m.fecha}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <p className={`text-xs font-black ${m.tipo==='venta'?'text-green-400':'text-red-400'}`}>
                              {m.tipo==='venta'?'+':'-'}{formatEuro(m.cantidad)}€
                            </p>
                            <button onClick={()=>borrar(m.id)} className="opacity-0 group-hover:opacity-100 text-gray-800 hover:text-red-400 text-[10px] transition-all">✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ───── TRANSACCIONES ───── */}
          {tab === 'transacciones' && (
            <div className="bg-[#080808] border border-white/[0.05] rounded-2xl overflow-hidden">
              <div className="px-6 py-5 border-b border-white/[0.04] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold">Todas las transacciones</p>
                  <p className="text-[11px] text-gray-700 mt-0.5">{filtrados.length} movimientos · {periodo === 'mes' ? 'este mes' : periodo === 'semana' ? 'esta semana' : 'en total'}</p>
                </div>
                <button onClick={()=>setModal(true)} className="self-start sm:self-auto text-xs font-bold text-green-400 border border-green-500/20 bg-green-500/5 hover:bg-green-500/10 px-4 py-2 rounded-xl transition-all">
                  + Nuevo
                </button>
              </div>

              {filtrados.length === 0 ? (
                <div className="py-24 text-center space-y-3">
                  <p className="text-gray-700 text-sm">Sin transacciones en este periodo</p>
                  <button onClick={()=>setModal(true)} className="text-green-400 text-xs hover:underline">Añadir la primera →</button>
                </div>
              ) : (
                <>
                  <div className="hidden md:grid grid-cols-12 px-6 py-3 text-[10px] font-bold text-gray-800 uppercase tracking-[0.15em]">
                    <div className="col-span-1"/>
                    <div className="col-span-4">Descripción</div>
                    <div className="col-span-2">Categoría</div>
                    <div className="col-span-2">Tipo</div>
                    <div className="col-span-2">Fecha</div>
                    <div className="col-span-1 text-right">Importe</div>
                  </div>
                  <div className="divide-y divide-white/[0.03]">
                    {filtrados.map(m => (
                      <div key={m.id} className="group grid grid-cols-12 px-6 py-4 hover:bg-white/[0.015] transition-colors items-center">
                        <div className="col-span-1">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${m.tipo==='venta'?'bg-green-500/10 text-green-400':'bg-white/[0.04]'}`}
                            style={m.tipo==='gasto'?{color:CAT_COLORS[m.categoria]}:{}}>
                            {CAT_ICONS[m.categoria]||'○'}
                          </div>
                        </div>
                        <div className="col-span-7 md:col-span-4">
                          <p className="text-sm font-semibold text-white">{m.descripcion}</p>
                          <p className="text-[11px] text-gray-700 md:hidden">{m.categoria} · {m.fecha}</p>
                        </div>
                        <div className="hidden md:flex col-span-2 items-center">
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-white/[0.03] text-gray-600 border border-white/[0.04]">{m.categoria}</span>
                        </div>
                        <div className="hidden md:flex col-span-2 items-center">
                          <span className={`text-[11px] px-2.5 py-1 rounded-lg font-bold border ${m.tipo==='venta'?'bg-green-500/8 text-green-400 border-green-500/15':'bg-red-500/8 text-red-400 border-red-500/15'}`}>
                            {m.tipo==='venta'?'Ingreso':'Gasto'}
                          </span>
                        </div>
                        <div className="hidden md:block col-span-2 text-[11px] text-gray-700">{m.fecha}</div>
                        <div className="col-span-4 md:col-span-1 flex items-center justify-end gap-3">
                          <p className={`text-sm font-black ${m.tipo==='venta'?'text-green-400':'text-red-400'}`}>
                            {m.tipo==='venta'?'+':'-'}{formatEuro(m.cantidad)}€
                          </p>
                          <button onClick={()=>borrar(m.id)} className="opacity-0 group-hover:opacity-100 text-gray-800 hover:text-red-400 text-[10px] transition-all">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-4 border-t border-white/[0.04] flex justify-between items-center">
                    <p className="text-xs text-gray-700">{filtrados.length} transacciones</p>
                    <div className="flex gap-6 text-xs">
                      <span className="text-green-400 font-bold">+{formatEuro(totalV)}€</span>
                      <span className="text-red-400 font-bold">-{formatEuro(totalG)}€</span>
                      <span className={`font-black ${balance>=0?'text-white':'text-red-400'}`}>{balance>=0?'+':''}{formatEuro(balance)}€</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ───── ANÁLISIS ───── */}
          {tab === 'analisis' && (
            <div className="space-y-5">
              {/* Métricas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { l: 'Días activos', v: grafica.length.toString() },
                  { l: 'Ingreso/día', v: grafica.length>0?formatEuro(totalV/grafica.length)+'€':'—' },
                  { l: 'Ticket medio', v: ventas.length>0?formatEuro(ticketMedio)+'€':'—' },
                  { l: 'Ratio gasto', v: totalV>0?((totalG/totalV)*100).toFixed(0)+'%':'—' },
                ].map(s=>(
                  <div key={s.l} className="bg-[#080808] border border-white/[0.05] rounded-2xl p-5 text-center">
                    <p className="text-[10px] text-gray-700 uppercase tracking-wider mb-2">{s.l}</p>
                    <p className="text-2xl font-black text-white">{s.v}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-5">
                {/* Ingresos por cat */}
                <div className="bg-[#080808] border border-white/[0.05] rounded-2xl p-6">
                  <p className="text-sm font-bold text-white mb-0.5">Ingresos por categoría</p>
                  <p className="text-[11px] text-gray-700 mb-6">Distribución de tus fuentes de ingreso</p>
                  {Object.keys(bycat('venta')).length>0 ? (
                    <div className="space-y-5">
                      {Object.entries(bycat('venta')).sort((a,b)=>b[1]-a[1]).map(([cat,val])=>(
                        <div key={cat}>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="flex items-center gap-2 text-gray-400">
                              <span className="text-base" style={{color:CAT_COLORS[cat]||'#6366f1'}}>{CAT_ICONS[cat]||'○'}</span>
                              {cat}
                            </span>
                            <span className="text-white font-black">{formatEuro(val)}€ <span className="text-gray-700 font-normal">· {totalV>0?((val/totalV)*100).toFixed(0):0}%</span></span>
                          </div>
                          <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000" style={{width:`${totalV>0?(val/totalV)*100:0}%`,backgroundColor:CAT_COLORS[cat]||'#6366f1'}} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ):<p className="text-gray-700 text-sm">Sin ingresos registrados</p>}
                </div>

                {/* Gastos por cat */}
                <div className="bg-[#080808] border border-white/[0.05] rounded-2xl p-6">
                  <p className="text-sm font-bold text-white mb-0.5">Gastos por categoría</p>
                  <p className="text-[11px] text-gray-700 mb-6">En qué estás gastando tu dinero</p>
                  {Object.keys(bycat('gasto')).length>0 ? (
                    <div className="space-y-5">
                      {Object.entries(bycat('gasto')).sort((a,b)=>b[1]-a[1]).map(([cat,val])=>(
                        <div key={cat}>
                          <div className="flex justify-between text-xs mb-2">
                            <span className="flex items-center gap-2 text-gray-400">
                              <span className="text-base" style={{color:CAT_COLORS[cat]||'#64748b'}}>{CAT_ICONS[cat]||'○'}</span>
                              {cat}
                            </span>
                            <span className="text-white font-black">{formatEuro(val)}€ <span className="text-gray-700 font-normal">· {totalG>0?((val/totalG)*100).toFixed(0):0}%</span></span>
                          </div>
                          <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000" style={{width:`${totalG>0?(val/totalG)*100:0}%`,backgroundColor:CAT_COLORS[cat]||'#64748b'}} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ):<p className="text-gray-700 text-sm">Sin gastos registrados</p>}
                </div>
              </div>

              {/* Tendencia área */}
              {grafica.length > 1 && (
                <div className="bg-[#080808] border border-white/[0.05] rounded-2xl p-6">
                  <p className="text-sm font-bold text-white mb-0.5">Tendencia de ingresos</p>
                  <p className="text-[11px] text-gray-700 mb-6">Evolución acumulada en el periodo</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={grafica} margin={{top:0,right:0,left:-28,bottom:0}}>
                      <defs>
                        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="1 1" stroke="#ffffff03" vertical={false}/>
                      <XAxis dataKey="d" tick={{fill:'#2d2d2d',fontSize:10}} tickLine={false} axisLine={false}/>
                      <YAxis tick={{fill:'#2d2d2d',fontSize:10}} tickLine={false} axisLine={false}/>
                      <Tooltip cursor={{stroke:'#22c55e30',strokeWidth:1}}
                        contentStyle={{backgroundColor:'#080808',border:'1px solid #111',borderRadius:'12px',color:'#fff',fontSize:'12px',padding:'10px 14px'}}
                        formatter={(v:number)=>[`${formatEuro(v)}€`,'Ingresos']}/>
                      <Area type="monotone" dataKey="v" stroke="#22c55e" strokeWidth={1.5} fill="url(#ag)"/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* ═══ MODAL ═══ */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-xl">
          <div className="w-full max-w-md bg-[#0a0a0a] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden">

            {/* Header modal */}
            <div className="px-6 pt-6 pb-5 border-b border-white/[0.05] flex justify-between items-center">
              <div>
                <h3 className="text-base font-black">Nuevo movimiento</h3>
                <p className="text-[11px] text-gray-700 mt-0.5">Registra un ingreso o gasto</p>
              </div>
              <button onClick={()=>setModal(false)} className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-gray-600 hover:text-white transition-all text-sm">✕</button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Toggle tipo */}
              <div className="flex gap-2 bg-white/[0.03] border border-white/[0.05] rounded-2xl p-1">
                <button onClick={()=>{setTipo('venta');setCategoria('General')}}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${tipo==='venta'?'bg-green-500 text-black shadow-lg shadow-green-500/20':'text-gray-700 hover:text-gray-500'}`}>
                  <span>↑</span> Ingreso
                </button>
                <button onClick={()=>{setTipo('gasto');setCategoria('General')}}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm transition-all ${tipo==='gasto'?'bg-red-500 text-white shadow-lg shadow-red-500/20':'text-gray-700 hover:text-gray-500'}`}>
                  <span>↓</span> Gasto
                </button>
              </div>

              {/* Importe grande */}
              <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 focus-within:border-green-500/30 transition-colors">
                <p className="text-[10px] text-gray-700 uppercase tracking-wider mb-1">Importe</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 text-2xl font-black">€</span>
                  <input
                    className="flex-1 bg-transparent text-3xl font-black text-white placeholder-gray-800 focus:outline-none"
                    placeholder="0.00"
                    type="number"
                    value={cantidad}
                    onChange={e=>setCantidad(e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&agregar()}
                    autoFocus
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4 focus-within:border-green-500/30 transition-colors">
                <p className="text-[10px] text-gray-700 uppercase tracking-wider mb-1">Descripción</p>
                <input
                  className="w-full bg-transparent text-sm text-white placeholder-gray-700 focus:outline-none"
                  placeholder="Ej: Venta en el mercadillo"
                  value={descripcion}
                  onChange={e=>setDescripcion(e.target.value)}
                  onKeyDown={e=>e.key==='Enter'&&agregar()}
                />
              </div>

              {/* Categoría */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl px-5 py-4">
                <p className="text-[10px] text-gray-700 uppercase tracking-wider mb-2">Categoría</p>
                <div className="flex flex-wrap gap-2">
                  {(tipo==='venta'?CATEGORIAS_VENTA:CATEGORIAS_GASTO).map(c=>(
                    <button key={c} onClick={()=>setCategoria(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${categoria===c?'bg-white/10 text-white border-white/20':'text-gray-700 border-white/[0.04] hover:text-gray-400'}`}>
                      {CAT_ICONS[c]} {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <button onClick={agregar}
                className={`w-full py-4 rounded-2xl font-black text-base transition-all ${tipo==='venta'?'bg-green-500 hover:bg-green-400 text-black shadow-xl shadow-green-500/20':'bg-red-500 hover:bg-red-400 text-white shadow-xl shadow-red-500/20'}`}>
                Registrar {tipo==='venta'?'ingreso':'gasto'} →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
