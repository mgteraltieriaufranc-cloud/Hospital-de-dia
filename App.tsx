
import React, { useState } from 'react';
import { 
  Heart, 
  FileText, 
  Calendar, 
  Users, 
  Info, 
  Activity,
  UserCircle,
  Stethoscope,
  Sparkles,
  ArrowRight,
  Clock,
  Coffee,
  ShieldCheck,
  Brain,
  MessageCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { getSmartOrientation } from './services/geminiService';

const DOCTORS = [
  { name: 'Dr. Dubersarsky', specialty: 'Oncología Clínica' },
  { name: 'Dr. Ortiz', specialty: 'Oncología Clínica' },
  { name: 'Dra. Di Sisto', specialty: 'Oncología Clínica' },
  { name: 'Dra. Miranda', specialty: 'Oncología Clínica' },
];

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsLoading(true);
    const response = await getSmartOrientation(query);
    setAiResponse(response);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header Institucional */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-700 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <Activity className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hospital de Día</h1>
              <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wider">Gestión y Acompañamiento</p>
            </div>
          </div>
          <div className="hidden lg:flex items-center space-x-8 text-sm font-bold text-slate-600">
            <a href="#gestion" className="hover:text-indigo-700 transition-colors">Gestión Administrativa</a>
            <a href="#informacion" className="hover:text-indigo-700 transition-colors">Información de Sesión</a>
            <a href="#oncologia" className="hover:text-indigo-700 transition-colors">Oncología</a>
            <a href="#salud-mental" className="hover:text-indigo-700 transition-colors">Salud Mental</a>
          </div>
        </div>
      </nav>

      {/* Hero: Bienvenida y Propósito */}
      <header className="bg-gradient-to-b from-white to-slate-50 pt-20 pb-28 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center space-x-2 py-1.5 px-4 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full mb-8 uppercase tracking-widest border border-indigo-100">
            <Heart size={14} className="fill-indigo-700" />
            <span>Estamos con vos en cada paso</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.1]">
            Un espacio pensado para <br className="hidden md:block" />
            <span className="text-indigo-700">tu bienestar y organización.</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Bienvenido a nuestro portal de orientación. Aquí encontrarás la información necesaria para gestionar tu atención, 
            conocer los pasos de tu tratamiento y acceder al apoyo administrativo y emocional que necesitás.
          </p>

          {/* AI Search: Asistente de Orientación */}
          <div className="max-w-2xl mx-auto relative group">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="¿Cómo podemos orientarte hoy? (Ej: ¿Cómo pido un turno con Judith?)"
                className="w-full pl-7 pr-36 py-6 bg-white border-2 border-slate-200 rounded-3xl shadow-2xl shadow-indigo-100/50 focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-3 top-3 bottom-3 bg-indigo-700 text-white px-8 rounded-2xl font-bold flex items-center space-x-2 hover:bg-indigo-800 transition-all transform active:scale-95 disabled:opacity-50"
              >
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Sparkles size={18} />}
                <span>Orientarme</span>
              </button>
            </form>

            {aiResponse && (
              <div className="mt-8 p-8 bg-white border border-indigo-100 rounded-3xl text-left shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 p-2 rounded-xl text-indigo-700">
                    <Sparkles size={20} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-indigo-700 uppercase mb-2 tracking-wider">Respuesta de Orientación</h4>
                    <p className="text-slate-700 text-base leading-relaxed mb-4">{aiResponse}</p>
                    <button 
                      onClick={() => setAiResponse(null)}
                      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                    >
                      Cerrar orientación
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 1. Gestión Administrativa */}
      <section id="gestion" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="inline-block p-3 bg-blue-50 text-blue-700 rounded-2xl mb-6">
                <FileText size={32} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6">Gestión Administrativa</h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Entendemos que la gestión de turnos y trámites es parte fundamental de tu tranquilidad. 
                Nuestra referente administrativa, <strong>Judith Ponce</strong>, brinda una atención humana, cálida y profesional, 
                enfocada en acompañarte y ordenar tus consultas para que puedas enfocarte en tu recuperación.
              </p>
              <div className="bg-slate-50 border border-slate-100 p-6 rounded-3xl mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-full border-2 border-indigo-100 flex items-center justify-center text-indigo-600 font-black">JP</div>
                  <div>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Referente del área</p>
                    <p className="text-lg font-bold text-slate-800">Judith Ponce</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 text-slate-600 text-sm mb-2 font-medium">
                  <Clock size={16} className="text-indigo-500" />
                  <span>Horarios de Atención: Lunes a Viernes 08:00 - 17:00hs</span>
                </div>
                <p className="text-xs text-slate-500 italic">Nuestro rol es brindarte orden y previsibilidad en cada solicitud.</p>
              </div>
              <button className="flex items-center space-x-3 bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-800 transition-all shadow-lg shadow-indigo-100">
                <span>Gestionar con Judith</span>
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-2xl group-hover:bg-indigo-500/20 transition-all"></div>
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
                  className="relative rounded-[2.5rem] shadow-2xl border border-white"
                  alt="Gestión Administrativa"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Información para la sesión */}
      <section id="informacion" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Información para tu sesión</h2>
            <p className="text-slate-600 max-w-2xl mx-auto font-medium">Recomendaciones para transitar tu jornada en el Hospital de Día con tranquilidad.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Preparación',
                icon: <ShieldCheck size={24} />,
                items: ['Desayuno ligero', 'Hidratación previa', 'Ropa cómoda'],
                color: 'bg-emerald-50 text-emerald-700 border-emerald-100'
              },
              {
                title: 'Elementos útiles',
                icon: <Coffee size={24} />,
                items: ['Libro o música', 'Manta pequeña', 'Un acompañante'],
                color: 'bg-amber-50 text-amber-700 border-amber-100'
              },
              {
                title: 'Durante el proceso',
                icon: <MessageCircle size={24} />,
                items: ['Escucha tu cuerpo', 'Avisa si hay molestias', 'Paciencia y calma'],
                color: 'bg-blue-50 text-blue-700 border-blue-100'
              },
              {
                title: 'Post-sesión',
                icon: <AlertCircle size={24} />,
                items: ['Reposo relativo', 'Control de fiebre', 'Seguir indicaciones'],
                color: 'bg-rose-50 text-rose-700 border-rose-100'
              }
            ].map((card, i) => (
              <div key={i} className={`p-8 rounded-[2rem] border ${card.color} flex flex-col h-full shadow-sm`}>
                <div className="mb-6 p-3 bg-white/60 rounded-2xl w-fit shadow-sm">{card.icon}</div>
                <h3 className="text-xl font-bold mb-4">{card.title}</h3>
                <ul className="space-y-3 mt-auto">
                  {card.items.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm font-semibold opacity-80">
                      <div className="w-1.5 h-1.5 rounded-full bg-current"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Apoyo Emocional */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-rose-50 rounded-[3rem] p-12 md:p-16 relative border border-rose-100 shadow-sm overflow-hidden text-center">
            <Heart size={80} className="absolute -bottom-8 -right-8 text-rose-200/50 rotate-12" />
            <h3 className="text-3xl font-black text-rose-900 mb-6">No estás solo en esto.</h3>
            <p className="text-lg text-rose-800 leading-relaxed font-medium mb-8">
              Es natural sentir miedo, ansiedad o incertidumbre. Validar tus emociones es el primer paso para transitarlas. 
              Nuestro equipo de salud no solo atiende tu cuerpo, sino que está aquí para acompañarte, escucharte y sostenerte.
            </p>
            <div className="flex items-center justify-center space-x-2 text-rose-900 font-bold uppercase tracking-widest text-xs">
              <ShieldCheck size={16} />
              <span>Compromiso Humano y Profesional</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Oncología Staff */}
      <section id="oncologia" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4">
            <div>
              <h2 className="text-4xl font-black text-slate-900 mb-4">Equipo de Oncología</h2>
              <p className="text-slate-600 font-medium max-w-xl">
                Profesionales dedicados a la excelencia clínica y la cercanía humana. 
                Los sobreturnos se reservan exclusivamente para emergencias oncológicas.
              </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-widest">
              Horarios sujetos a agenda médica
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl mb-6 flex items-center justify-center text-slate-400 group-hover:bg-indigo-700 group-hover:text-white transition-all">
                  <UserCircle size={32} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-1 leading-tight">{doc.name}</h4>
                <p className="text-sm font-bold text-indigo-600 mb-8 uppercase tracking-wide">{doc.specialty}</p>
                <button className="w-full py-4 bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 hover:text-white transition-all">
                  Solicitar turno
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Hospital de Día: Servicios */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-indigo-900 rounded-[3rem] p-12 md:p-20 text-white overflow-hidden relative">
            <Activity size={200} className="absolute -top-20 -right-20 text-white/5" />
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Servicios de <br />Hospital de Día</h2>
              <p className="text-indigo-100 text-lg mb-12 leading-relaxed font-medium">
                Infraestructura y cuidado especializado para tratamientos ambulatorios complejos. 
                Organizamos cada procedimiento con enfoque en tu seguridad y confort.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {['Quimioterapia', 'Infusiones', 'Hierro'].map((service, i) => (
                  <button key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl hover:bg-white hover:text-indigo-900 transition-all text-left">
                    <p className="text-sm font-bold uppercase tracking-widest mb-1 opacity-60">Servicio</p>
                    <p className="text-lg font-black">{service}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Salud Mental */}
      <section id="salud-mental" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-xl grid lg:grid-cols-2">
            <div className="p-12 md:p-16">
              <div className="p-3 bg-purple-50 text-purple-700 rounded-2xl w-fit mb-8">
                <Brain size={32} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Salud Mental y Apoyo</h2>
              <div className="mb-8">
                <p className="text-sm font-bold text-purple-600 uppercase tracking-widest mb-1">Profesional a cargo</p>
                <p className="text-2xl font-black text-slate-800">Mgter. Altieri Aufranc</p>
              </div>
              <p className="text-slate-600 leading-relaxed mb-10 font-medium">
                Un acompañamiento terapéutico respetuoso y contenedor para transitar el impacto psicológico del tratamiento. 
                Integramos diversas herramientas para fortalecer tu resiliencia y bienestar emocional.
              </p>
              <div className="flex flex-wrap gap-3 mb-12">
                {['Terapia ACT', 'Musicoterapia', 'Habilidades Sociales'].map((tag, i) => (
                  <span key={i} className="px-4 py-2 bg-purple-50 text-purple-700 text-xs font-bold rounded-xl border border-purple-100">
                    {tag}
                  </span>
                ))}
              </div>
              <button className="flex items-center space-x-3 bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-purple-800 transition-all shadow-lg shadow-purple-100">
                <span>Solicitar acompañamiento</span>
                <ArrowRight size={18} />
              </button>
            </div>
            <div className="bg-purple-50 flex items-center justify-center p-12">
              <div className="text-center">
                 <div className="w-32 h-32 bg-white rounded-full border-4 border-purple-200 flex items-center justify-center text-purple-600 mb-8 mx-auto shadow-inner">
                    <Heart size={48} className="fill-purple-100" />
                 </div>
                 <p className="text-purple-900 font-black text-xl italic leading-tight italic">
                  "El cuidado del alma es <br /> parte de la medicina."
                 </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Información y Turnos: Centralización */}
      <section className="py-24 bg-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-4xl font-black mb-8">Información y Turnos</h3>
          <p className="text-lg text-indigo-100 mb-12 leading-relaxed font-medium">
            Nuestro portal centraliza todas las solicitudes para optimizar tu tiempo y el de nuestro staff médico. 
            Todas las derivaciones se realizan de forma segura y ordenada para garantizar una atención de calidad.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button className="bg-white text-indigo-700 px-10 py-5 rounded-2xl font-black hover:bg-indigo-50 transition-all shadow-xl flex items-center justify-center space-x-2">
              <Calendar size={20} />
              <span>Ver Centros de Derivación</span>
            </button>
            <button className="bg-indigo-600 border border-indigo-400 text-white px-10 py-5 rounded-2xl font-black hover:bg-indigo-500 transition-all flex items-center justify-center space-x-2">
              <ExternalLink size={20} />
              <span>Preguntas Frecuentes</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer Institucional */}
      <footer className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <Activity size={24} className="text-indigo-700" />
                <span className="text-xl font-black text-slate-900">Hospital de Día</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm font-medium">
                Portal institucional dedicado a la orientación, organización administrativa y acompañamiento emocional del paciente oncológico. No se promete atención inmediata fuera de emergencias clínicas.
              </p>
            </div>
            <div>
              <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Ubicación y Contacto</h5>
              <div className="space-y-4 text-sm text-slate-500 font-bold">
                <p>Sede Central: Lunes a Viernes 08:00 - 20:00hs</p>
                <p>Gestión Judith Ponce: 09:00 - 17:00hs</p>
              </div>
            </div>
            <div>
              <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-6">Legal</h5>
              <div className="space-y-4 text-sm text-slate-500 font-bold">
                <a href="#" className="hover:text-indigo-700">Privacidad de Datos</a>
                <a href="#" className="hover:text-indigo-700">Derechos del Paciente</a>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-slate-400 text-xs font-bold uppercase tracking-widest space-y-4 md:space-y-0">
            <p>© 2024 Centro de Orientación Institucional. Todos los derechos reservados.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-indigo-700">Instagram</a>
              <a href="#" className="hover:text-indigo-700">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
