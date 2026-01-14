
import React, { useState, useRef, useEffect } from 'react';
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
  Facebook,
  ExternalLink,
  ChevronRight,
  RefreshCw
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
  const [error, setError] = useState<string | null>(null);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const aprossSectionRef = useRef<HTMLElement>(null);

  const handleSearch = async (e?: React.FormEvent, manualQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = (manualQuery || query).trim();
    if (!finalQuery) return;
    
    setIsLoading(true);
    setAiResponse(null);
    setError(null);
    
    try {
      const response = await getSmartOrientation(finalQuery);
      setAiResponse(response);
      
      // Forzar scroll al resultado en Google Sites usando un pequeño retraso
      setTimeout(() => {
        if (responseRef.current) {
          responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    } catch (err) {
      console.error("Clinical Search Error:", err);
      setError("No pudimos conectar con el asistente. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToApross = () => {
    aprossSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openPami = () => {
    window.open("https://prestadores.pami.org.ar/", "_blank");
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col selection:bg-emerald-100 font-sans text-slate-900">
      
      {/* BARRA DE ACCESOS DIRECTOS - STICKY PARA GOOGLE SITES */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <button 
            onClick={openPami}
            className="flex items-center space-x-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-4 py-2 rounded-full transition-all group"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600"></span>
            </span>
            <span className="text-[10px] font-black text-orange-800 uppercase tracking-widest">PAMI Prestadores</span>
            <ExternalLink size={12} className="text-orange-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button 
            onClick={scrollToApross}
            className="flex items-center space-x-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-full transition-all group"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Guía APROSS</span>
            <ChevronRight size={14} className="text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* HEADER */}
      <nav className="bg-white px-6 py-6 border-b border-slate-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center md:justify-start">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-700 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Activity size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none">Hospital de Día</h1>
              <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-[0.2em] mt-1.5">Sanatorio Aconcagua</p>
            </div>
          </div>
        </div>
      </nav>

      {/* BUSCADOR INTELIGENTE - OPTIMIZADO */}
      <header className="bg-emerald-900 pt-16 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Buscador Inteligente</h2>
          <p className="text-emerald-100 text-lg mb-12 opacity-90 max-w-2xl mx-auto">Pregunta sobre turnos, horarios o preparativos y te guiaremos.</p>

          <div className="max-w-2xl mx-auto">
            <div className="relative mb-8">
              {/* Barra de progreso de carga superior */}
              {isLoading && (
                <div className="absolute -top-1 left-0 right-0 h-1 bg-emerald-500 overflow-hidden rounded-full z-20">
                  <div className="h-full bg-white animate-[loading_1.5s_infinite] w-1/2"></div>
                </div>
              )}
              
              <form onSubmit={handleSearch} className="relative group shadow-2xl rounded-[2rem] overflow-hidden">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                  <Search size={24} />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full pl-16 pr-32 py-7 bg-white border-none text-lg font-medium outline-none placeholder:text-slate-300"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="absolute right-3 top-3 bottom-3 bg-emerald-700 hover:bg-emerald-800 text-white px-6 rounded-[1.5rem] transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  <span className="hidden sm:inline font-bold">Analizar</span>
                </button>
              </form>
            </div>

            {/* QUICK ACTION CHIPS - REORDENADOS */}
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

            {/* AREA DE RESPUESTA CON REFRENCIA PARA SCROLL */}
            <div ref={responseRef} className="scroll-mt-24">
              {error && (
                <div className="bg-red-50 border border-red-100 p-6 rounded-3xl text-red-800 flex items-center justify-between animate-in fade-in zoom-in-95">
                  <div className="flex items-center space-x-4">
                    <AlertCircle size={24} className="shrink-0" />
                    <p className="font-bold text-sm text-left">{error}</p>
                  </div>
                  <button onClick={() => handleSearch()} className="p-2 hover:bg-red-100 rounded-full transition-colors">
                    <RefreshCw size={18} />
                  </button>
                </div>
              )}

              {aiResponse && (
                <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden text-left animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <div className="bg-slate-50 px-8 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-emerald-700 font-black text-[11px] uppercase tracking-widest">
                      <BookOpen size={16} />
                      <span>Respuesta del Asistente</span>
                    </div>
                    <button onClick={() => setAiResponse(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-10">
                    <p className="text-slate-700 text-lg leading-relaxed font-medium whitespace-pre-wrap">{aiResponse}</p>
                    <div className="mt-8 pt-8 border-t border-slate-50 flex items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
                      <Info size={14} className="mr-2 text-emerald-500" />
                      <span>Usa las secciones de abajo para más información</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* SECCIÓN ADMINISTRACIÓN */}
      <section id="administrativo" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl font-black text-slate-900 mb-8 uppercase tracking-tight">Gestión Administrativa</h2>
            <div className="bg-[#fdfbf7] p-10 rounded-[3rem] border border-slate-100 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-8">
              <div className="w-24 h-24 bg-emerald-700 text-white rounded-full flex items-center justify-center font-black text-3xl shadow-xl border-4 border-white shrink-0">JP</div>
              <div className="text-center sm:text-left">
                <h4 className="text-2xl font-black text-slate-900 mb-1">Judith Ponce</h4>
                <p className="text-emerald-700 font-black uppercase text-[11px] tracking-widest mb-4">Central de Turnos</p>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center sm:justify-start space-x-3 text-slate-500 font-bold text-sm">
                    <Clock size={18} className="text-emerald-600" />
                    <span>Lunes a Viernes 08:00 - 16:00 hs</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">Judith centraliza toda la gestión de turnos y procesos administrativos, garantizando una atención personalizada.</p>
          </div>
          <div className="order-1 lg:order-2">
            <div className="rounded-[4rem] overflow-hidden shadow-2xl border-[12px] border-white">
              <img src="https://images.unsplash.com/photo-1576765608596-724a276d5335?auto=format&fit=crop&q=80&w=1200" alt="Administración" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN PREPARACIÓN */}
      <section id="paciente" className="py-24 px-6 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-4xl font-black mb-16 uppercase tracking-tight text-center">Preparación Paciente</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-sm">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8"><Coffee size={32}/></div>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-widest text-emerald-400">Para tu sesión</h3>
              <ul className="space-y-5 text-emerald-50/80 font-medium">
                <li>• Alimentación liviana (arroz, banana).</li>
                <li>• Hidratación abundante el día previo.</li>
                <li>• Ropa cómoda y manta personal.</li>
              </ul>
            </div>
            <div className="bg-white/5 border border-white/10 p-12 rounded-[3.5rem] backdrop-blur-sm">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-8"><ShieldCheck size={32}/></div>
              <h3 className="text-2xl font-black mb-6 uppercase tracking-widest text-emerald-400">Normas</h3>
              <ul className="space-y-5 text-emerald-50/80 font-medium">
                <li>• Evitar perfumes intensos.</li>
                <li>• Uso de auriculares obligatorio.</li>
                <li>• Carnet y estudios siempre a mano.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN STAFF MÉDICO */}
      <section id="staff" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Staff de Oncología</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="bg-[#fdfbf7] p-10 rounded-[2.5rem] border border-slate-100 text-center hover:bg-emerald-50 transition-all group duration-300 shadow-sm hover:shadow-xl">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-inner border-4 border-white">
                  <UserCircle size={48} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">{doc.name}</h4>
                <p className="text-[10px] font-black text-emerald-700 uppercase mb-10 tracking-[0.2em]">{doc.specialty}</p>
                <a href="https://forms.gle/ddstx18jrp8MpjmX8" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full py-4 bg-white text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700 transition-all shadow-sm">Pedir Turno</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN SALUD MENTAL */}
      <section id="salud-mental" className="py-24 px-6 bg-indigo-50/40">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="bg-white p-14 rounded-[4rem] shadow-2xl border border-slate-100">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mb-10"><Brain size={40} /></div>
            <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Salud Mental</h2>
            <h4 className="text-2xl font-black text-slate-800">Terapeuta Altieri Aufranc</h4>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">Especialista en Terapia ACT y Musicoterapia. Acompañamiento integral para el bienestar emocional.</p>
            <a href="https://forms.gle/ddstx18jrp8MpjmX8" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl transition-all">Solicitar Turno</a>
          </div>
          <div className="bg-indigo-700 text-white p-20 rounded-[4rem] text-center flex flex-col justify-center items-center h-full min-h-[450px] relative overflow-hidden shadow-2xl">
            <Heart size={300} fill="white" className="absolute opacity-5 -top-20 -right-20" />
            <div className="relative z-10">
              <Heart size={80} className="mx-auto mb-10 text-white/40" />
              <p className="text-4xl md:text-5xl font-black italic leading-tight">"Cuidamos a la persona, <br/>no solo al paciente."</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN APROSS */}
      <section id="apross-section" ref={aprossSectionRef} className="py-24 px-6 bg-[#fdfbf7] border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-10 text-orange-600">
            <Bell size={32} />
            <h2 className="text-3xl font-black uppercase tracking-tight">Guía Empadronamiento APROSS</h2>
          </div>
          <div className="bg-white rounded-[3rem] shadow-xl border border-orange-100 p-12 md:p-16">
            <p className="text-lg text-slate-600 font-medium mb-12">El empadronamiento es clave para asegurar la provisión de medicamentos.</p>
            <div className="grid gap-8">
              <div className="flex items-start space-x-6 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-md">1</div>
                <div><h5 className="text-xl font-black text-slate-900 mb-2">Mi Portal APROSS</h5><p className="text-slate-500 font-medium">Ingresa a la web con tus credenciales.</p></div>
              </div>
              <div className="flex items-start space-x-6 p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                <div className="w-12 h-12 bg-emerald-700 text-white rounded-2xl flex items-center justify-center font-black text-xl shrink-0 shadow-md">2</div>
                <div><h5 className="text-xl font-black text-emerald-900 mb-2">Documentación</h5><p className="text-emerald-700 font-medium">Sube fotos de tus estudios y pedido médico.</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 bg-[#0a1210] text-white/50 text-center">
        <div className="max-w-5xl mx-auto">
          <Activity size={48} className="text-emerald-700 mx-auto mb-10" />
          <p className="text-[12px] font-black uppercase tracking-[0.4em] mb-10">Hospital de Día & Fundación Claudio Dubersarsky</p>
          <div className="mt-20 pt-10 border-t border-white/5">
            <p className="text-[10px] tracking-widest font-bold">© 2026 HOSPITAL DE DÍA. TODOS LOS DERECHOS RESERVADOS.</p>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default App;
