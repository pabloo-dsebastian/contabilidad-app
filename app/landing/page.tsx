'use client'

import { useState, useEffect, useRef } from 'react'

const REVIEWS = [
  { name: 'María García', role: 'Vendedora de mercadillo · Madrid', avatar: 'MG', stars: 5, text: 'Llevaba años apuntando todo en papel y siempre me liaba con las cuentas. Con Contto en 3 segundos tengo el balance del día. Ha cambiado mi forma de trabajar.' },
  { name: 'Carlos Ruiz', role: 'Electricista autónomo · Barcelona', avatar: 'CR', stars: 5, text: 'Llevo 6 años como autónomo y nunca había tenido tan claro lo que ganaba. Mis cuentas por fin tienen sentido. Se lo he recomendado a todos los autónomos que conozco.' },
  { name: 'Ana Martínez', role: 'Peluquera freelance · Valencia', avatar: 'AM', stars: 5, text: 'Mis clientes me pagan en efectivo y antes nunca sabía cuánto era al final del mes. Ahora lo veo al momento desde el móvil. Imprescindible.' },
  { name: 'Javier López', role: 'Feriante · Sevilla', avatar: 'JL', stars: 5, text: 'Trabajo en ferias y mercados por toda España. Antes era un caos llevar las cuentas. Ahora registro cada venta al momento y al final del día sé exactamente lo que he ganado.' },
  { name: 'Laura Sánchez', role: 'Diseñadora freelance · Bilbao', avatar: 'LS', stars: 5, text: 'Uso Contto para controlar mis proyectos y gastos profesionales. Es tan sencillo que lo uso a diario. Antes usaba Excel y era una pesadilla, ahora tardo segundos.' },
  { name: 'Miguel Torres', role: 'Fontanero autónomo · Zaragoza', avatar: 'MT', stars: 5, text: 'Al principio dudé si sería demasiado simple, pero es justo lo que necesitaba. Claro, rápido y siempre disponible en el móvil. No volvería a Excel ni loco.' },
  { name: 'Sofía Jiménez', role: 'Profesora particular · Málaga', avatar: 'SJ', stars: 5, text: 'Doy clases a varios alumnos y me costaba controlar los pagos. Contto me ha salvado la vida. Registro cada cobro al instante y al mes sé perfectamente lo que he ganado.' },
  { name: 'Roberto Díaz', role: 'Carpintero autónomo · Murcia', avatar: 'RD', stars: 5, text: 'Mi gestor me pedía siempre un resumen de ingresos y gastos. Antes tardaba horas en hacerlo. Ahora con Contto lo tengo al momento. Ha simplificado mi vida enormemente.' },
  { name: 'Isabel Moreno', role: 'Esteticista · Alicante', avatar: 'IM', stars: 5, text: 'Llevo un salón pequeño y necesitaba algo simple para controlar las cuentas. Contto es perfecto. Nada de formularios complicados, solo registrar y ver el balance.' },
]

export default function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [count, setCount] = useState(0)
  const [activeFeature, setActiveFeature] = useState(0)
  const reviewsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c < 1247 ? c + 17 : 1247)
    }, 8)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(f => (f + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[30%] w-[70vw] h-[70vw] bg-green-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[40vw] h-[40vw] bg-emerald-400/[0.03] rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] left-[-5%] w-[50vw] h-[50vw] bg-green-600/[0.03] rounded-full blur-[100px]" />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.015]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
      </div>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#050505]/85 backdrop-blur-2xl border-b border-white/[0.06]' : ''}`}>
        <div className="flex justify-between items-center px-8 py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-green-500/40">C</div>
            <span className="text-xl font-bold tracking-tight">Contto</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#funciones" className="hover:text-white transition-colors duration-200">Funciones</a>
            <a href="#como-funciona" className="hover:text-white transition-colors duration-200">Cómo funciona</a>
            <a href="#precios" className="hover:text-white transition-colors duration-200">Precios</a>
            <a href="#resenas" className="hover:text-white transition-colors duration-200">Reseñas</a>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-gray-500 hover:text-white text-sm transition-colors duration-200 hidden md:block">Iniciar sesión</a>
            <a href="/login" className="relative group bg-white text-black px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all duration-200 shadow-xl shadow-white/10">
              Empezar gratis
              <span className="ml-1.5 group-hover:translate-x-0.5 inline-block transition-transform duration-200">→</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-52 pb-36 px-6 text-center">
        <div className="relative max-w-5xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.08] rounded-full px-5 py-2.5 text-xs font-semibold mb-12 backdrop-blur-sm">
            <span className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-xs">★</span>)}
            </span>
            <span className="text-gray-300">{count.toLocaleString()} autónomos ya controlan sus cuentas con Contto</span>
          </div>

          <h1 className="text-7xl md:text-[100px] font-black mb-8 leading-[0.9] tracking-tighter">
            Tus cuentas,<br />
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 via-emerald-400 to-green-500">
                al instante.
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
            </span>
          </h1>

          <p className="text-gray-400 text-2xl mb-14 max-w-2xl mx-auto leading-relaxed font-light">
            La app de contabilidad más simple para autónomos y vendedores españoles. Registra ventas y gastos en segundos. Sabe exactamente cuánto ganas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
            <a href="/login" className="group relative bg-green-500 hover:bg-green-400 text-white px-10 py-5 rounded-2xl text-lg font-black transition-all duration-300 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-1 w-full sm:w-auto">
              <span className="relative z-10">Crear cuenta gratis →</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent" />
            </a>
            <a href="#como-funciona" className="group bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white px-10 py-5 rounded-2xl text-lg font-semibold transition-all duration-300 w-full sm:w-auto text-center">
              Ver demo
              <span className="ml-2 group-hover:ml-3 transition-all duration-200">↓</span>
            </a>
          </div>

          {/* Trust */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-12 text-sm">
            {[
              { icon: '🔒', text: 'Datos cifrados y seguros' },
              { icon: '⚡', text: 'Setup en 30 segundos' },
              { icon: '💳', text: 'Sin tarjeta de crédito' },
              { icon: '🇪🇸', text: 'Hecho en España' },
            ].map(t => (
              <div key={t.text} className="flex items-center gap-2 text-gray-500">
                <span>{t.icon}</span>
                <span>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-20 border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-white/5">
          {[
            { val: '+1.200', label: 'Autónomos activos' },
            { val: '< 3s', label: 'Para registrar una venta' },
            { val: '4.9/5', label: 'Valoración media' },
            { val: '0€', label: 'Para empezar' },
          ].map(s => (
            <div key={s.label} className="text-center md:px-8">
              <p className="text-4xl md:text-5xl font-black text-white mb-2">{s.val}</p>
              <p className="text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* App mockup */}
      <section className="px-6 py-32 max-w-lg mx-auto relative" id="como-funciona">
        <div className="absolute -inset-8 bg-green-500/5 rounded-[4rem] blur-3xl" />
        <div className="absolute -inset-2 bg-gradient-to-b from-green-500/10 to-transparent rounded-[3rem] blur-xl" />

        <div className="relative bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          {/* Header app */}
          <div className="bg-gradient-to-r from-green-500/10 to-transparent border-b border-white/5 px-6 pt-8 pb-6">
            <div className="flex justify-between items-center mb-1">
              <div>
                <p className="text-xl font-black">Contto</p>
                <p className="text-xs text-gray-500">pablo@empresa.com</p>
              </div>
              <button className="text-xs text-gray-600 border border-white/5 px-3 py-1 rounded-full">Salir</button>
            </div>
          </div>

          <div className="p-5">
            {/* Periodo */}
            <div className="flex gap-1.5 mb-5">
              {['Todo', 'Este mes', 'Esta semana'].map((p, i) => (
                <div key={p} className={`flex-1 text-center py-2 rounded-full text-xs font-bold transition-all ${i === 1 ? 'bg-white text-black' : 'bg-white/5 text-gray-500'}`}>{p}</div>
              ))}
            </div>

            {/* Balance card */}
            <div className="relative bg-gradient-to-br from-green-500/25 via-green-500/10 to-transparent border border-green-500/25 rounded-2xl p-6 text-center mb-4 overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-400/10 rounded-full blur-2xl" />
              <p className="text-xs font-semibold text-green-400/70 uppercase tracking-wider mb-2">Balance del mes</p>
              <p className="text-5xl font-black text-green-400 mb-1">+1.240€</p>
              <div className="flex items-center justify-center gap-1.5 text-xs text-green-400/60">
                <span>↑ 18% vs mes anterior</span>
              </div>
            </div>

            {/* Ventas/Gastos */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              <div className="bg-green-500/[0.08] border border-green-500/15 rounded-xl p-4 text-center">
                <p className="text-xs font-semibold text-green-400/60 mb-1.5">↑ VENTAS</p>
                <p className="text-2xl font-black text-green-400">1.850€</p>
                <p className="text-xs text-green-400/40 mt-1">12 transacciones</p>
              </div>
              <div className="bg-red-500/[0.08] border border-red-500/15 rounded-xl p-4 text-center">
                <p className="text-xs font-semibold text-red-400/60 mb-1.5">↓ GASTOS</p>
                <p className="text-2xl font-black text-red-400">610€</p>
                <p className="text-xs text-red-400/40 mt-1">5 transacciones</p>
              </div>
            </div>

            {/* Movimientos */}
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Últimos movimientos</p>
            {[
              { desc: 'Venta mercadillo sábado', cat: 'Producto', cant: '+320€', tipo: 'venta', fecha: 'Hoy' },
              { desc: 'Reposición de material', cat: 'Material', cant: '-145€', tipo: 'gasto', fecha: 'Ayer' },
              { desc: 'Servicio cliente premium', cat: 'Servicio', cant: '+580€', tipo: 'venta', fecha: 'Ayer' },
              { desc: 'Transporte feria', cat: 'Transporte', cant: '-65€', tipo: 'gasto', fecha: 'Lun' },
            ].map((m, i) => (
              <div key={i} className="flex justify-between items-center p-3 mb-1.5 rounded-xl hover:bg-white/[0.03] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${m.tipo === 'venta' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                    {m.tipo === 'venta' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{m.desc}</p>
                    <p className="text-xs text-gray-600">{m.cat} · {m.fecha}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className={`text-sm font-black ${m.tipo === 'venta' ? 'text-green-400' : 'text-red-400'}`}>{m.cant}</p>
                  <span className="text-gray-700 opacity-0 group-hover:opacity-100 text-xs transition-opacity">✕</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funciones */}
      <section id="funciones" className="px-6 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-5">Funciones</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Todo lo que necesitas.<br /><span className="text-gray-500">Nada que no.</span></h2>
          <p className="text-gray-400 text-xl max-w-xl mx-auto font-light">Diseñado para que cualquier persona pueda controlar sus cuentas. Sin formación, sin manuales.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: '⚡', title: 'Registro ultrarrápido', desc: 'Registra una venta o un gasto en menos de 3 segundos. Desde cualquier dispositivo. Sin abrir Excel, sin formularios interminables.', tag: 'Core' },
            { icon: '📊', title: 'Balance en tiempo real', desc: 'Ve exactamente cuánto ganas en el día, la semana o el mes. El balance se actualiza al instante cada vez que añades un movimiento.', tag: 'Core' },
            { icon: '🗂️', title: 'Categorías inteligentes', desc: 'Organiza cada movimiento por categoría: material, transporte, servicios, productos... Ten todo clasificado sin esfuerzo.', tag: 'Core' },
            { icon: '📅', title: 'Filtros por periodo', desc: 'Analiza tus números por día, semana o mes. Detecta tus mejores periodos y toma mejores decisiones.', tag: 'Análisis' },
            { icon: '🔐', title: 'Tu cuenta privada', desc: 'Tus datos son completamente privados. Acceso con email y contraseña. Cifrado de extremo a extremo. Nadie más los ve.', tag: 'Seguridad' },
            { icon: '📱', title: 'Funciona en todo', desc: 'Móvil, tablet, ordenador. Siempre sincronizado. Sin instalar nada. Abre el navegador y ya está.', tag: 'Acceso' },
            { icon: '🗑️', title: 'Edición fácil', desc: '¿Te equivocaste? Borra cualquier movimiento con un tap. Limpio, rápido y sin complicaciones.', tag: 'Core' },
            { icon: '📄', title: 'Exportar a PDF', desc: 'Genera un resumen mensual en PDF para tu gestor o asesor fiscal. Un click y listo.', tag: 'Pro' },
            { icon: '🤖', title: 'IA financiera', desc: 'Próximamente: recibe consejos personalizados basados en tus números. Como tener un asesor financiero en el bolsillo.', tag: 'Próximo' },
          ].map(f => (
            <div key={f.title} className="group relative bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-green-500/20 rounded-3xl p-8 transition-all duration-500 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/[0.03] rounded-full blur-3xl group-hover:bg-green-500/[0.08] transition-all duration-500" />
              <div className="flex justify-between items-start mb-5">
                <p className="text-4xl">{f.icon}</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${f.tag === 'Pro' ? 'bg-green-500/15 text-green-400 border border-green-500/20' : f.tag === 'Próximo' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/20' : 'bg-white/5 text-gray-500 border border-white/5'}`}>{f.tag}</span>
              </div>
              <h3 className="text-lg font-bold mb-3">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Cómo funciona - pasos */}
      <section className="px-6 py-32 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-5">Así de simple</p>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter">En 3 pasos y 30 segundos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-10 left-[33%] right-[33%] h-px bg-gradient-to-r from-white/5 via-green-500/30 to-white/5" />
            {[
              { n: '01', icon: '✉️', title: 'Crea tu cuenta', desc: 'Solo tu email y una contraseña. Sin datos bancarios, sin formularios largos. En 30 segundos estás dentro.' },
              { n: '02', icon: '⚡', title: 'Registra al momento', desc: 'Cada venta o gasto cuando ocurre. Descripción, categoría y cantidad. 3 segundos y listo.' },
              { n: '03', icon: '📊', title: 'Controla tu dinero', desc: 'Ve tu balance actualizado. Por semana, mes o lo que necesites. Sabe siempre en qué estás.' },
            ].map((s, i) => (
              <div key={s.n} className="relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 text-center">
                <div className="w-14 h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">{s.icon}</div>
                <p className="text-green-500/40 text-5xl font-black absolute top-6 right-6">{s.n}</p>
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para quién */}
      <section className="px-6 py-32 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-5">Para ti</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">¿Trabajas por tu cuenta?<br /><span className="text-gray-500">Contto es para ti.</span></h2>
          <p className="text-gray-400 text-xl max-w-xl mx-auto font-light">Si cobras por tus servicios o productos y quieres controlar tu dinero sin complicarte, bienvenido.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { emoji: '🛒', label: 'Vendedores', desc: 'Mercadillos y ferias' },
            { emoji: '🔧', label: 'Autónomos', desc: 'Todo tipo de oficios' },
            { emoji: '🎪', label: 'Feriantes', desc: 'Ferias y eventos' },
            { emoji: '💻', label: 'Freelancers', desc: 'Trabajo digital' },
            { emoji: '✂️', label: 'Peluqueros', desc: 'Salones y a domicilio' },
            { emoji: '📚', label: 'Profesores', desc: 'Clases particulares' },
            { emoji: '🍕', label: 'Hostelería', desc: 'Bares y restaurantes' },
            { emoji: '🚚', label: 'Transportistas', desc: 'Autónomos del transporte' },
          ].map(p => (
            <div key={p.label} className="group bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-green-500/20 rounded-2xl p-5 transition-all duration-300 cursor-pointer">
              <span className="text-3xl mb-3 block">{p.emoji}</span>
              <p className="font-bold text-sm text-white mb-1">{p.label}</p>
              <p className="text-xs text-gray-600">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reseñas */}
      <section id="resenas" className="py-32 bg-white/[0.01] border-y border-white/[0.05] overflow-hidden">
        <div className="text-center mb-16 px-6">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-5">Reseñas</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">Lo que dicen<br />nuestros usuarios</h2>
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400 text-xl">★</span>)}
            </div>
            <span className="text-gray-400 font-semibold ml-2">4.9 de 5 · Más de 1.200 reseñas</span>
          </div>
        </div>

        <div className="px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-7 hover:border-green-500/15 transition-all duration-300">
              <div className="flex gap-0.5 mb-5">
                {[...Array(r.stars)].map((_, j) => <span key={j} className="text-yellow-400 text-sm">★</span>)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-xs font-black text-black flex-shrink-0">
                  {r.avatar}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{r.name}</p>
                  <p className="text-gray-600 text-xs">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Precios */}
      <section id="precios" className="px-6 py-32 max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-5">Precios</p>
          <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">Simple y justo.</h2>
          <p className="text-gray-400 text-xl max-w-xl mx-auto font-light">Empieza gratis. Paga solo si necesitas más. Sin letra pequeña.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free */}
          <div className="bg-white/[0.02] border border-white/[0.08] rounded-3xl p-10">
            <div className="mb-8">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Plan Gratis</p>
              <div className="flex items-end gap-2">
                <p className="text-6xl font-black">0€</p>
                <p className="text-gray-500 mb-2">/ mes</p>
              </div>
              <p className="text-gray-600 text-sm mt-2">Para siempre. Sin caducidad.</p>
            </div>
            <ul className="space-y-4 mb-10">
              {[
                'Ventas y gastos ilimitados',
                'Balance en tiempo real',
                'Filtros por día, semana y mes',
                'Categorías básicas',
                'Acceso desde cualquier dispositivo',
                'Soporte por email',
              ].map(f => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span className="text-green-400 font-black mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-300">{f}</span>
                </li>
              ))}
            </ul>
            <a href="/login" className="block text-center bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white py-4 rounded-2xl font-bold text-sm transition-all">
              Empezar gratis
            </a>
          </div>

          {/* Pro */}
          <div className="relative bg-gradient-to-b from-green-500/15 to-green-500/[0.03] border border-green-500/25 rounded-3xl p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-400/10 rounded-full blur-3xl" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 to-emerald-500 text-black text-xs font-black px-5 py-1.5 rounded-full shadow-lg shadow-green-500/30">
              ⭐ MÁS POPULAR
            </div>
            <div className="relative mb-8">
              <p className="text-sm font-bold text-green-400 uppercase tracking-wider mb-4">Plan Pro</p>
              <div className="flex items-end gap-2">
                <p className="text-6xl font-black">4,99€</p>
                <p className="text-gray-400 mb-2">/ mes</p>
              </div>
              <p className="text-gray-500 text-sm mt-2">Cancela cuando quieras.</p>
            </div>
            <ul className="space-y-4 mb-10 relative">
              {[
                'Todo lo del plan Gratis',
                'Exportar PDF para tu gestor',
                'Gráficas de evolución mensual',
                'Categorías ilimitadas y personalizadas',
                'Soporte prioritario 24/7',
                'Acceso anticipado a nuevas funciones',
                'Próximamente: IA para consejos financieros',
              ].map(f => (
                <li key={f} className="flex items-start gap-3 text-sm">
                  <span className="text-green-400 font-black mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-200">{f}</span>
                </li>
              ))}
            </ul>
            <a href="/login" className="relative block text-center bg-green-500 hover:bg-green-400 text-white py-4 rounded-2xl font-black text-sm transition-all shadow-xl shadow-green-500/30 hover:shadow-green-500/50">
              Empezar con Pro →
            </a>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-8">¿Tienes dudas? <a href="mailto:hola@contto.es" className="text-green-400 hover:underline">Escríbenos</a> y te ayudamos.</p>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-32 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-5">FAQ</p>
            <h2 className="text-5xl font-black tracking-tighter">Preguntas frecuentes</h2>
          </div>
          <div className="space-y-3">
            {[
              { q: '¿De verdad es gratis?', a: 'Sí, el plan básico es completamente gratis para siempre. Sin truco, sin caducidad, sin tarjeta de crédito. Puedes usarlo indefinidamente con todas las funciones básicas.' },
              { q: '¿Necesito saber de contabilidad para usarlo?', a: 'Para nada. Si sabes que has cobrado dinero o lo has gastado, puedes usar Contto. Solo hay dos botones: venta y gasto. Es así de simple.' },
              { q: '¿Mis datos están seguros?', a: 'Sí. Todos tus datos están cifrados y almacenados de forma segura. Nunca los compartimos con terceros ni los usamos para publicidad. Tus cuentas son tuyas.' },
              { q: '¿Puedo usarlo desde el móvil?', a: 'Perfectamente. Contto funciona en cualquier dispositivo con un navegador: móvil, tablet u ordenador. No hay que instalar nada.' },
              { q: '¿Puedo cancelar el plan Pro cuando quiera?', a: 'Sí, sin permanencia, sin penalizaciones y sin preguntas. Cancelas cuando quieras desde tu cuenta en menos de un minuto.' },
              { q: '¿Contto sirve para declarar impuestos?', a: 'Contto no es un software de contabilidad oficial, pero te ayuda a tener un registro claro de tus ingresos y gastos que puedes compartir con tu gestor para que lleve la contabilidad oficial.' },
            ].map((f, i) => (
              <div key={i} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] rounded-2xl p-7 transition-all duration-300 cursor-pointer">
                <p className="font-bold text-white mb-3 flex justify-between items-center">
                  {f.q}
                  <span className="text-gray-600 group-hover:text-green-400 transition-colors text-lg ml-4 flex-shrink-0">+</span>
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-40 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/[0.04] to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-green-500/8 rounded-full blur-[150px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.3em] mb-8">Empieza hoy</p>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
            Tu dinero,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-500">bajo control.</span>
          </h2>
          <p className="text-gray-400 text-xl mb-14 font-light max-w-xl mx-auto">Únete a más de 1.200 autónomos que ya saben exactamente cuánto ganan cada día.</p>
          <a href="/login" className="group inline-flex items-center gap-4 bg-white text-black px-14 py-7 rounded-2xl text-xl font-black transition-all hover:bg-gray-50 hover:-translate-y-1 shadow-2xl shadow-white/10">
            Crear cuenta gratis
            <span className="group-hover:translate-x-1 transition-transform duration-200 text-2xl">→</span>
          </a>
          <p className="text-gray-700 text-sm mt-8">Sin tarjeta de crédito · Sin compromisos · Cancela cuando quieras</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center text-sm font-black">C</div>
              <span className="text-lg font-bold">Contto</span>
            </div>
            <div className="flex gap-8 text-sm text-gray-600">
              <a href="#funciones" className="hover:text-white transition-colors">Funciones</a>
              <a href="#precios" className="hover:text-white transition-colors">Precios</a>
              <a href="#resenas" className="hover:text-white transition-colors">Reseñas</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="mailto:hola@contto.es" className="hover:text-white transition-colors">hola@contto.es</a>
            </div>
          </div>
          <div className="border-t border-white/[0.05] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-700 text-sm">© 2025 Contto · Todos los derechos reservados</p>
            <p className="text-gray-700 text-sm">Hecho con ❤️ en España 🇪🇸</p>
          </div>
        </div>
      </footer>

    </main>
  )
}
