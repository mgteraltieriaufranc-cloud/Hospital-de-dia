
import React, { useState, useRef } from 'react';
import { 
  Heart, 
  Activity,
  UserCircle,
  Sparkles,
  Clock,
  Coffee,
  ShieldCheck,
  Brain,
  BrainCircuit,
  AlertCircle,
  Search,
  BookOpen,
  Info,
  Users,
  Phone,
  Mail,
  MapPin,
  Bell,
  X,
  Stethoscope,
  Instagram,
  Facebook
} from 'lucide-react';
import { getSmartOrientation } from './services/geminiService';

const DOCTORS = [
  { name: 'Dr. Dubersarsky', specialty: 'Oncología Clínica' },
  { name: 'Dr. Ortiz', specialty: 'Oncología Clínica' },
  { name: 'Dra. Di Sisto', specialty: 'Oncología Clínica' },
  { name: 'Dra. Miranda', specialty: 'Oncología Clínica' },
];

const QUICK_ACTIONS = [
  { label: 'Horarios Judith', query: '¿En qué horario atiende Judith Ponce en administración?', icon: <Clock size={14}/> },
  { label: 'Hospital De día', query: '¿Qué servicios ofrece el Hospital de Día y cómo funciona?', icon: <Activity size={14}/> },
  { label: 'Preparación Sesión', query: '¿Qué debo hacer antes de ir a mi sesión de quimioterapia?', icon: <Coffee size={14}/> },
  { label: 'Staff médico', query: '¿Quiénes son los oncólogos del hospital y cómo saco turno?', icon: <Stethoscope size={14}/> },
  { label: 'Salud mental', query: '¿Cómo pido turno con el Terapeuta Altieri Aufranc?', icon: <Brain size={14}/> },
];

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAprossModal, setShowAprossModal] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchSectionRef = useRef<HTMLElement>(null);

  const handleSearch = async (e?: React.FormEvent, manualQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = manualQuery || query;
    if (!finalQuery.trim()) return;
    
    setIsLoading(true);
    setAiResponse(null);
    const response = await getSmartOrientation(finalQuery);
    setAiResponse(response);
    setIsLoading(false);

    // Scroll suave dentro del frame para Google Sites
    if (manualQuery || e) {
      setTimeout(() => {
        searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => searchInputRef.current?.focus(), 800);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col selection:bg-emerald-100 relative">
      
      {/* BARRA DE ALERTAS STICKY - OPTIMIZADA PARA GOOGLE SITES */}
      <div className="sticky top-0 z-[60] w-full bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* BOTÓN PAMI IZQUIERDO */}
          <a 
            href="https://prestadores.pami.org.ar/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center space-x-2 bg-white border border-orange-100 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
            <span className="text-[9px] font-black text-orange-700 uppercase tracking-widest">PAMI Prestadores</span>
          </a>

          {/* BOTÓN APROSS DERECHO */}
          <button 
            onClick={() => setShowAprossModal(true)}
            className="group flex items-center space-x-2 bg-white border border-orange-100 px-3 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
            </span>
            <span className="text-[9px] font-black text-orange-700 uppercase tracking-widest">Novedades APROSS</span>
          </button>
        </div>
      </div>

      {/* MODAL APROSS */}
      {showAprossModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setShowAprossModal(false)}
              className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-10 md:p-14">
              <div className="flex items-center space-x-3 text-orange-600 mb-6">
                <Bell size={24} />
                <span className="text-xs font-black uppercase tracking-[0.2em]">Guía para el Afiliado</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">Empadronamiento Online APROSS</h2>
              <div className="space-y-8 text-slate-600 font-medium">
                <p>El <strong>Empadronamiento Online</strong> es esencial para validar tu cobertura y asegurar tu medicación.</p>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <h4 className="font-black text-emerald-800 mb-2">Paso 1: Portal APROSS</h4>
                  <p className="text-sm">Ingresa con tu usuario y contraseña a la web oficial de APROSS.</p>
                </div>
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                  <h4 className="font-black text-amber-800 mb-2">Paso 2: Documentación</h4>
                  <p className="text-sm">Sube fotos legibles de tus estudios y el pedido médico de tu oncólogo.</p>
                </div>
              </div>
              <div className="mt-12 text-center">
                <button onClick={() => setShowAprossModal(false)} className="bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-800">Cerrar Guía</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <nav className="bg-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center text-white shadow-md">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-none">Hospital de Día</h1>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1">Gestión & Fundación</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <a href="#administrativo" className="hover:text-emerald-700">Gestión</a>
            <a href="#paciente" className="hover:text-emerald-700">Preparación</a>
            <a href="#fundacion" className="hover:text-emerald-700">Fundación</a>
            <button onClick={scrollToSearch} className="bg-emerald-700 text-white px-5 py-2.5 rounded-full shadow-lg">Consultas</button>
          </div>
        </div>
      </nav>

      {/* SECCIÓN BUSCADOR / IA */}
      <header ref={searchSectionRef} className="bg-emerald-900 pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">Cuidado integral.</h2>
            <p className="text-emerald-100 text-lg opacity-90">Gestión de turnos y acompañamiento especializado.</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="relative mb-6">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={22} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="¿que necesitas encontrar hoy?"
                className="w-full pl-16 pr-10 py-6 bg-white border-none rounded-2xl shadow-2xl text-lg font-medium focus:ring-4 focus:ring-emerald-500/20 outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>

            {/* BOTONES DE ACCESO RÁPIDO - ORDEN SOLICITADO */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(action.query);
                    handleSearch(undefined, action.query);
                  }}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            {aiResponse && (
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-700 font-black text-[10px] uppercase tracking-widest">
                    <BookOpen size={14} />
                    <span>Respuesta del Facilitador</span>
                  </div>
                  <button onClick={() => setAiResponse(null)} className="text-slate-400 hover:text-slate-600">
                    <X size={18} />
                  </button>
                </div>
                <div className="p-10">
                  <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{aiResponse}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* CONTENIDO INFORMATIVO */}
      <section id="administrativo" className="py-20 px-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase">Gestión Administrativa</h2>
            <div className="bg-[#fdfbf7] p-8 rounded-[2.5rem] border border-slate-100 flex items-center space-x-6 shadow-sm mb-6">
              <div className="w-16 h-16 bg-emerald-700 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-white shrink-0">JP</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Judith Ponce</h4>
                <p className="text-sm text-slate-500 font-bold">Lunes a Viernes 08:00 - 16:00 hs</p>
                <p className="text-[10px] text-emerald-700 font-black uppercase mt-1">Central de Turnos</p>
              </div>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed">Judith centraliza la atención de cada consulta, asegurando que el ingreso al Hospital de Día sea ágil y humano.</p>
          </div>
          <div className="rounded-[3rem] overflow-hidden shadow-xl border-8 border-white">
            <img src="https://images.unsplash.com/photo-1576765608596-724a276d5335?auto=format&fit=crop&q=80&w=800" alt="Administración" className="w-full h-auto" />
          </div>
        </div>
      </section>

      <section id="paciente" className="py-20 px-6 bg-[#fdfbf7]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-12 uppercase text-center">Preparación Paciente</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-6"><Coffee size={24}/></div>
              <h3 className="text-xl font-black mb-4 uppercase">Para tu sesión</h3>
              <ul className="space-y-3 text-slate-600 text-sm font-medium">
                <li>• Alimentación liviana (arroz, banana, yogur).</li>
                <li>• Hidratación constante desde el día previo.</li>
                <li>• Ropa cómoda y manta personal.</li>
              </ul>
            </div>
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center mb-6"><ShieldCheck size={24}/></div>
              <h3 className="text-xl font-black mb-4 uppercase">Recomendaciones</h3>
              <ul className="space-y-3 text-slate-600 text-sm font-medium">
                <li>• Evitar perfumes fuertes en la sala.</li>
                <li>• Traer estudios previos y carnet.</li>
                <li>• Música o lectura para mayor comodidad.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="staff" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-black text-slate-900 mb-12 uppercase text-center">Staff Médico</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="bg-[#fdfbf7] p-8 rounded-[2rem] border border-slate-100 text-center hover:bg-emerald-50 transition-all group">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-sm">
                  <UserCircle size={32} />
                </div>
                <h4 className="font-black text-slate-900">{doc.name}</h4>
                <p className="text-[10px] font-black text-emerald-700 uppercase mb-6 tracking-widest">{doc.specialty}</p>
                <a href="https://forms.gle/ddstx18jrp8MpjmX8" target="_blank" rel="noopener noreferrer" className="block w-full py-3 bg-white text-slate-700 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700">Pedir Turno</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="salud-mental" className="py-20 px-6 bg-indigo-50/30">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><Brain size={32} /></div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase">Salud Mental</h2>
            <h4 className="text-xl font-bold text-slate-800 mb-4">Terapeuta Altieri Aufranc</h4>
            <p className="text-slate-600 font-medium leading-relaxed mb-8">Especialista en Terapia ACT y Musicoterapia. Brinda un espacio de acompañamiento fundamental para el paciente oncológico y su familia.</p>
            <a href="https://forms.gle/ddstx18jrp8MpjmX8" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest text-center shadow-lg hover:bg-indigo-700 transition-all">Solicitar Turno con el Especialista</a>
          </div>
          <div className="bg-indigo-600 text-white p-12 rounded-[3rem] text-center flex flex-col justify-center min-h-[400px]">
            <Heart size={64} className="mx-auto mb-8 opacity-30" />
            <p className="text-3xl font-black italic leading-tight">"Cuidamos a la persona, <br/>no solo al paciente."</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 bg-[#0a1210] text-white/50 text-center">
        <div className="max-w-4xl mx-auto">
          <Activity size={40} className="text-emerald-700 mx-auto mb-8" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-8">Hospital de Día & Fundación Dubersarsky</p>
          <div className="flex justify-center space-x-6 mb-12">
            <a href="https://wa.me/5493518693409" className="text-emerald-600 hover:text-emerald-400 transition-colors"><Phone size={24} /></a>
            <Instagram size={24} className="text-emerald-600" />
            <Facebook size={24} className="text-emerald-600" />
          </div>
          <p className="text-[9px] max-w-lg mx-auto leading-relaxed">La información es orientativa. El diagnóstico médico debe ser establecido por un profesional matriculado.</p>
          <div className="mt-12 pt-8 border-t border-white/5 text-[9px]">© 2026 Sanatorio Aconcagua - Córdoba, Argentina.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
