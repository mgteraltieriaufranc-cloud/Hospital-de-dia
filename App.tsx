
import React, { useState, useRef } from 'react';
import { 
  Heart, 
  FileText, 
  Calendar, 
  Activity,
  UserCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Coffee,
  ShieldCheck,
  Brain,
  BrainCircuit,
  MessageCircle,
  AlertCircle,
  ExternalLink,
  Search,
  BookOpen,
  Info,
  Users,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  Facebook,
  Instagram,
  Bell,
  X,
  ChevronDown,
  Stethoscope
} from 'lucide-react';
import { getSmartOrientation } from './services/geminiService';

const DOCTORS = [
  { name: 'Dr. Dubersarsky', specialty: 'Oncología Clínica' },
  { name: 'Dr. Ortiz', specialty: 'Oncología Clínica' },
  { name: 'Dra. Di Sisto', specialty: 'Oncología Clínica' },
  { name: 'Dra. Miranda', specialty: 'Oncología Clínica' },
];

const SERVICES = [
  { name: 'PAMI', desc: 'Gestión y atención especializada para afiliados.' },
  { name: 'Obras Sociales', desc: 'Convenios con principales prestadoras.' },
  { name: 'Turnos Oncología', desc: 'Agenda médica programada.' },
  { name: 'Hematología', desc: 'Tratamientos onco-hematológicos.' },
  { name: 'Hospital de Día', desc: 'Infusiones y cuidados de sesión.' },
  { name: 'Salud Mental', desc: 'Apoyo emocional especializado.' },
  { name: 'Conversatorios', desc: 'Espacios de aprendizaje y comunidad.' },
];

const QUICK_ACTIONS = [
  { label: 'Turno Salud Mental', query: '¿Cómo pido turno con la psicóloga Altieri Aufranc?', icon: <Brain size={14}/> },
  { label: 'Preparación Sesión', query: '¿Qué debo hacer antes de ir a mi sesión de quimioterapia?', icon: <Coffee size={14}/> },
  { label: 'Staff Médico', query: '¿Quiénes son los oncólogos del hospital y cómo saco turno?', icon: <Stethoscope size={14}/> },
  { label: 'Horarios Judith', query: '¿En qué horario atiende Judith Ponce en administración?', icon: <Clock size={14}/> },
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

    // Scroll al resultado si es una acción rápida o manual
    if (manualQuery || e) {
      setTimeout(() => {
        window.scrollTo({ top: searchSectionRef.current?.offsetTop ? searchSectionRef.current.offsetTop - 100 : 0, behavior: 'smooth' });
      }, 100);
    }
  };

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => searchInputRef.current?.focus(), 800);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col selection:bg-emerald-100 relative">
      
      {/* LUZ INTERMITENTE NOVEDADES APROSS (TOP RIGHT) */}
      <div className="fixed top-24 right-6 z-[60] flex items-center">
        <button 
          onClick={() => setShowAprossModal(true)}
          className="group flex items-center space-x-3 bg-white border border-orange-100 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
          <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">Novedades APROSS</span>
        </button>
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
              
              <h2 className="text-3xl font-black text-slate-900 mb-8 leading-tight">
                Empadronamiento Online APROSS: <br/>
                <span className="text-emerald-700">Paso a paso para tu tranquilidad</span>
              </h2>

              <div className="prose prose-slate prose-emerald max-w-none">
                <p className="text-slate-600 font-medium mb-8 leading-relaxed">
                  Sabemos que gestionar trámites puede generar inquietud, especialmente cuando se trata de tu salud. El <strong>Empadronamiento Online</strong> es la forma en que APROSS valida tu condición para asegurar que recibas la medicación y los tratamientos adecuados sin demoras.
                </p>

                <div className="space-y-10">
                  <section>
                    <h3 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm mr-3">1</span>
                      ¿Cómo inicio el trámite? 📝
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed ml-11">
                      Debes ingresar al portal oficial de APROSS con tu usuario y contraseña. Allí encontrarás la sección de "Gestión de Afiliados" donde podrás actualizar tus datos de contacto y subir la documentación requerida por tu oncólogo.
                    </p>
                  </section>

                  <section>
                    <h3 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm mr-3">2</span>
                      Entendiendo los estados del trámite 🔄
                    </h3>
                    <div className="ml-11 grid gap-3">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start space-x-3">
                        <Clock size={18} className="text-amber-500 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Pendiente:</p>
                          <p className="text-xs text-slate-500">Tu solicitud ha sido recibida y está en espera de ser analizada por el equipo médico de la obra social.</p>
                        </div>
                      </div>
                      <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start space-x-3">
                        <AlertCircle size={18} className="text-rose-500 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Observado:</p>
                          <p className="text-xs text-slate-500">Falta alguna documentación o un estudio no es legible. ¡No te preocupes! Solo debes revisar el motivo y volver a subir lo solicitado.</p>
                        </div>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start space-x-3">
                        <ShieldCheck size={18} className="text-emerald-500 mt-0.5" />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">Aprobado / Empadronado:</p>
                          <p className="text-xs text-slate-500">¡Todo está en orden! Ya tienes la cobertura activa para retirar tu medicación o realizar tu tratamiento.</p>
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="flex items-center text-xl font-bold text-slate-800 mb-4">
                      <span className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm mr-3">3</span>
                      Documentación y Notificaciones 📧
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed ml-11 mb-4">
                      Asegúrate de que las fotos de tus estudios sean claras y se lean bien todos los datos. Si te falta algún estudio, puedes iniciar el trámite y subirlo luego cuando lo tengas.
                    </p>
                    <div className="ml-11 bg-emerald-900 text-white p-6 rounded-[2rem] flex items-center space-x-4">
                      <Info size={24} className="text-emerald-300 shrink-0" />
                      <p className="text-xs font-medium">Recibirás notificaciones por correo electrónico cada vez que el estado de tu trámite cambie. Mantente atento a tu casilla.</p>
                    </div>
                  </section>
                </div>

                <div className="mt-12 pt-10 border-t border-slate-100 text-center">
                  <p className="text-slate-500 italic text-sm mb-6">"Estamos aquí para guiarte. Si tienes dudas con el portal, acércate a Judith Ponce en administración para orientarte."</p>
                  <button 
                    onClick={() => setShowAprossModal(false)}
                    className="bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:bg-emerald-800 transition-all"
                  >
                    Entendido, gracias
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 1. HEADER / HERO */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-700 rounded-lg flex items-center justify-center text-white shadow-md">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-none">Hospital de Día</h1>
              <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1">Gestión & Fundación de Apoyo</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <a href="#institucional" className="hover:text-emerald-700">Nosotros</a>
            <a href="#administrativo" className="hover:text-emerald-700">Gestión</a>
            <a href="#paciente" className="hover:text-emerald-700">Preparación</a>
            <a href="#fundacion" className="hover:text-emerald-700">Fundación</a>
            <button 
              onClick={scrollToSearch}
              className="bg-emerald-700 text-white px-5 py-2.5 rounded-full hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-100 active:scale-95"
            >
              Consultas Rápidas
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION / IA ASSISTANT */}
      <header ref={searchSectionRef} className="bg-emerald-900 pt-20 pb-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2"></div>
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
              Cuidado integral <br/>
              <span className="text-emerald-300">Hospital de Día.</span>
            </h2>
            <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
              Consultas, turnos y servicios de acompañamiento. <br/>
              Diseñado para brindar tranquilidad en cada etapa del tratamiento.
            </p>
          </div>

          {/* 12. AUTOMATIZADOR DE RESPUESTAS */}
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center space-x-2 mb-4 text-emerald-300">
              <BrainCircuit size={18} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">¿Cómo podemos ayudarte hoy?</span>
            </div>
            <form onSubmit={handleSearch} className="relative mb-4">
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={22} />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="¿qué necesitas encontrar hoy?"
                className="w-full pl-16 pr-44 py-6 bg-white border-none rounded-2xl shadow-2xl text-lg font-medium focus:ring-4 focus:ring-emerald-500/20 focus:outline-none placeholder:text-slate-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-3 top-3 bottom-3 bg-emerald-700 text-white px-8 rounded-xl font-bold flex items-center space-x-2 hover:bg-emerald-800 transition-all disabled:opacity-50"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles size={16} />}
                <span>Analizar</span>
              </button>
            </form>

            {/* QUICK ACTION CHIPS */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(action.query);
                    handleSearch(undefined, action.query);
                  }}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all"
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
                    <span>Guía de Navegación del Hospital</span>
                  </div>
                  <button onClick={() => setAiResponse(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <AlertCircle size={18} />
                  </button>
                </div>
                <div className="p-10">
                  <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {aiResponse}
                  </p>
                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-[10px] font-black text-slate-400 uppercase italic">
                      <ShieldCheck size={14} className="text-emerald-500" />
                      <span>Consulta orientativa basada en el contenido de esta página.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. QUIÉNES SOMOS */}
      <section id="institucional" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-10">
            <Heart size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight">Nuestra Misión de Cuidado</h2>
          <p className="text-xl text-slate-600 font-medium leading-relaxed">
            En el Hospital de Día, entendemos que la medicina es técnica pero el cuidado es humano. 
            Nuestra labor está centrada en la persona, brindando una atención integral donde el acompañamiento 
            profesional y emocional son pilares inamovibles de nuestro servicio oncológico.
          </p>
        </div>
      </section>

      {/* 3. GESTIÓN ADMINISTRATIVA - JUDITH PONCE */}
      <section id="administrativo" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center space-x-2 py-1 px-3 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg mb-6 uppercase tracking-widest">
              <Users size={12} />
              <span>Atención Personalizada</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight leading-tight">
              Gestión Administrativa <br/>
              <span className="text-emerald-700">Judith Ponce</span>
            </h2>
            <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">
              La calidez en el trato es nuestro sello. Judith Ponce centraliza la atención de cada consulta e ingreso al Hospital de Día, 
              asegurando un proceso ordenado, ágil y, sobre todo, humano.
            </p>
            <div className="bg-[#fdfbf7] p-8 rounded-[2.5rem] border border-slate-100 flex items-center space-x-6 shadow-sm">
              <div className="w-16 h-16 bg-emerald-700 text-white rounded-full flex items-center justify-center font-black text-xl shadow-lg border-4 border-white">JP</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Judith Ponce</h4>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 text-sm text-slate-500 font-bold">
                    <Clock size={16} className="text-emerald-700" />
                    <span>Lun a Vie 08:00 - 16:00 hs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img src="https://images.unsplash.com/photo-1576765608596-724a276d5335?auto=format&fit=crop&q=80&w=1200" alt="Admin Judith Ponce" className="rounded-[3rem] shadow-2xl border-8 border-white" />
          </div>
        </div>
      </section>

      {/* 5. PREPARACIÓN PACIENTE */}
      <section id="paciente" className="py-24 px-6 bg-emerald-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-black mb-6 uppercase tracking-tight">Hospital de Día</h2>
              <p className="text-emerald-100 text-lg font-medium opacity-80 italic">"Prepararte ayuda a transitar mejor cada sesión."</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em]">Guía de Preparación</div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
              <div className="w-12 h-12 bg-white text-emerald-900 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                <Coffee size={24} />
              </div>
              <h3 className="text-xl font-black mb-6 uppercase">Sesión</h3>
              <ul className="space-y-4 text-emerald-100 font-medium text-sm">
                <li className="flex items-start space-x-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div><span>Comer liviano (arroz, banana, yogur).</span></li>
                <li className="flex items-start space-x-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div><span>Tomar líquidos desde el día anterior.</span></li>
                <li className="flex items-start space-x-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div><span>Dormir bien y descansar.</span></li>
                <li className="flex items-start space-x-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div><span>Ropa cómoda y abrigo liviano.</span></li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem]">
              <div className="w-12 h-12 bg-white text-emerald-900 rounded-2xl flex items-center justify-center mb-8 shadow-xl">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-black mb-6 uppercase">Recomendaciones</h3>
              <ul className="space-y-4 text-emerald-100 font-medium text-sm">
                <li className="flex items-start space-x-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div><span>Evitar perfumes o cremas con olor fuerte.</span></li>
                <li className="flex items-start space-x-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div><span>Traer manta liviana personal.</span></li>
                <li className="flex items-start space-x-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div><span>Algo para leer o música con auriculares.</span></li>
                <li className="flex items-start space-x-3"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-2 shrink-0"></div><span>Llevar estudios previos y carnet.</span></li>
              </ul>
            </div>

            <div className="bg-emerald-800 p-10 rounded-[3rem] shadow-2xl flex flex-col justify-center text-center">
              <Heart size={48} className="mx-auto mb-8 text-emerald-300" />
              <h3 className="text-xl font-black mb-4">No estás solo/a</h3>
              <p className="text-sm text-emerald-100 font-medium leading-relaxed">
                Es normal sentir miedo o ansiedad. Hablar con alguien ayuda. 
                Nuestro equipo de salud y acompañamiento emocional del Hospital de Día está aquí para vos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ONCOLOGÍA STAFF */}
      <section id="oncologia" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Staff de Oncología</h2>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">Excelencia Médica en el Hospital de Día</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="bg-[#fdfbf7] p-8 rounded-[2.5rem] border border-slate-100 text-center group hover:bg-emerald-50 transition-all">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-inner border-4 border-white">
                  <UserCircle size={40} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1">{doc.name}</h4>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-10">Médico Oncólogo</p>
                <a
                  href="https://forms.gle/ddstx18jrp8MpjmX8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-white text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700 transition-all shadow-sm text-center block"
                >
                  Pedir Turno
                </a>
              </div>
            ))}
          </div>
          <div className="mt-16 bg-rose-50 border border-rose-100 p-8 rounded-3xl flex items-start space-x-4 max-w-3xl mx-auto shadow-sm">
            <AlertCircle size={24} className="text-rose-600 shrink-0" />
            <div>
              <p className="text-rose-900 font-black text-sm uppercase tracking-widest mb-2">Aviso Importante</p>
              <p className="text-rose-800 text-sm font-medium leading-relaxed">
                Los sobreturnos en el Hospital de Día se otorgan únicamente en caso de <strong>emergencia oncológica</strong>: fiebre alta, dolor intenso o reacciones adversas inmediatas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SALUD MENTAL */}
      <section id="salud-mental" className="py-24 px-6 bg-[#fdfbf7]">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="bg-white p-12 lg:p-20 rounded-[4rem] shadow-xl border border-slate-100">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8"><Brain size={32} /></div>
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-tight leading-tight">Salud Mental <br/>y Acompañamiento</h2>
            <h4 className="text-xl font-bold text-slate-800 mb-4">Mgter. Altieri Aufranc</h4>
            <p className="text-lg text-slate-600 mb-10 font-medium leading-relaxed">
              El proceso oncológico en nuestro Hospital de Día requiere un soporte emocional validante. Trabajamos enfoques como Terapia ACT y Musicoterapia 
              para brindar herramientas de resiliencia al paciente y su familia.
            </p>
            <div className="flex flex-wrap gap-2 mb-10">
              {['Terapia ACT', 'Musicoterapia', 'Acompañamiento'].map((t, i) => (
                <span key={i} className="px-4 py-2 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-xl border border-indigo-100">{t}</span>
              ))}
              <a
                href="https://forms.gle/ddstx18jrp8MpjmX8"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-white text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-emerald-700 group-hover:text-white group-hover:border-emerald-700 transition-all shadow-sm text-center block mt-6"
              >
                Pedir Turno
              </a>
            </div>
          </div>
          <div className="bg-indigo-600 text-white p-16 lg:p-24 rounded-[4rem] relative overflow-hidden text-center flex flex-col justify-center items-center h-full min-h-[500px]">
            <Heart size={300} fill="white" className="absolute opacity-5 -top-10 -right-10" />
            <div className="relative z-10">
              <Heart size={64} className="mx-auto mb-10 opacity-30" />
              <p className="text-4xl font-black italic leading-tight mb-4">"No es solo curar el cuerpo, <br/>es cuidar a la persona."</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FUNDACIÓN */}
      <section id="fundacion" className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tight">Fundación Claudio Dubersarsky</h2>
          <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12">
            <strong>Misión:</strong> La Fundación Dr. Claudio Dubersarsky tiene como misión reducir la mortalidad por cáncer mediante la prevención, la docencia y la investigación. 
            Promueve la formación médica, la concientización comunitaria y el empoderamiento de pacientes en conjunto con el Hospital de Día.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://fundacionclaudiodubersarsky.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-emerald-700 text-white px-12 py-5 rounded-2xl font-black shadow-2xl hover:bg-emerald-800 transition-all">
                Conocer la Fundación
              </button>
            </a>

            <a
              href="https://campanitaescueladepacientes.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="bg-white text-emerald-700 border-2 border-emerald-700 px-12 py-5 rounded-2xl font-black shadow-2xl hover:bg-emerald-700 hover:text-white transition-all">
                Escuela de Pacientes
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* 11. CONTACTO RÁPIDO */}
      <section className="py-24 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/10 group hover:bg-emerald-700 transition-all">
            <Phone size={32} className="mb-6 text-emerald-400 group-hover:text-white" />
            <h4 className="text-lg font-black mb-2">WhatsApp</h4>
            <p className="text-slate-400 text-sm font-bold group-hover:text-emerald-100">+54 9 351 869-3409</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/10 group hover:bg-emerald-700 transition-all">
            <Mail size={32} className="mb-6 text-emerald-400 group-hover:text-white" />
            <h4 className="text-lg font-black mb-2">Email Hospital de Día</h4>
            <p className="text-slate-400 text-sm font-bold group-hover:text-emerald-100">info@sanatorioaconcagua.com</p>
          </div>
          <div className="flex flex-col items-center text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/10 group hover:bg-emerald-700 transition-all">
            <MapPin size={32} className="mb-6 text-emerald-400 group-hover:text-white" />
            <h4 className="text-lg font-black mb-2">Ubicación</h4>
            <p className="text-slate-400 text-sm font-bold group-hover:text-emerald-100 italic">Sanatorio Aconcagua</p>
            <p className="text-slate-400 text-xs font-bold group-hover:text-emerald-100">Paraná 560 2do piso - Córdoba Capital</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 bg-[#0a1210] text-white/50 text-center">
        <div className="max-w-4xl mx-auto">
          <Activity size={40} className="text-emerald-700 mx-auto mb-10" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-8">Portal Institucional - Hospital de Día</p>
          
          {/* REDES SOCIALES */}
          <div className="flex justify-center space-x-6 mb-12">
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-400 transition-colors">
              <Instagram size={28} />
            </a>
            <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-400 transition-colors">
              <Facebook size={28} />
            </a>
            <a href="https://wa.me/5493518693409" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-400 transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
                 <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path>
              </svg>
            </a>
          </div>

          <div className="flex justify-center space-x-6 mb-12 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white">Confidencialidad</a>
            <a href="#" className="hover:text-white">Derechos del Paciente</a>
            <a href="#" className="hover:text-white">Contacto</a>
          </div>
          <p className="text-[9px] max-w-lg mx-auto leading-relaxed">
            La información brindada en este sitio es de carácter orientativo. 
            El diagnóstico y tratamiento médico deben ser siempre establecidos por un profesional de la salud matriculado.
          </p>
          <div className="mt-16 pt-8 border-t border-white/5">
            <p className="text-[9px]">© 2026 Hospital de Día & Fundación Dubersarsky. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
