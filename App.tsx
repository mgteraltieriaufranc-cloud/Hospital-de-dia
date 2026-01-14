
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { 
  Heart, 
  Activity,
  UserCircle,
  Clock,
  Coffee,
  ShieldCheck,
  Brain,
  Stethoscope,
  ChevronRight,
  ExternalLink,
  Gamepad2,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  Bell,
  MapPin,
  ClipboardList,
  CheckCircle2,
  School,
  HandHelping
} from 'lucide-react';

// --- CONSTANTES ---
const DOCTORS = [
  { name: 'Dr. Dubersarsky', specialty: 'Oncología Clínica' },
  { name: 'Dr. Ortiz', specialty: 'Oncología Clínica' },
  { name: 'Dra. Di Sisto', specialty: 'Oncología Clínica' },
  { name: 'Dra. Miranda', specialty: 'Oncología Clínica' },
];

// --- TETRIS TERAPÉUTICO ---
const TETROMINOS = {
  I: { shape: [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], color: 'bg-emerald-400' },
  J: { shape: [[1,0,0],[1,1,1],[0,0,0]], color: 'bg-indigo-400' },
  L: { shape: [[0,0,1],[1,1,1],[0,0,0]], color: 'bg-emerald-600' },
  O: { shape: [[1,1],[1,1]], color: 'bg-amber-400' },
  S: { shape: [[0,1,1],[1,1,0],[0,0,0]], color: 'bg-emerald-500' },
  T: { shape: [[0,1,0],[1,1,1],[0,0,0]], color: 'bg-indigo-600' },
  Z: { shape: [[1,1,0],[0,1,1],[0,0,0]], color: 'bg-rose-400' }
};

const Tetris: React.FC = () => {
  const [grid, setGrid] = useState(Array(20).fill(null).map(() => Array(10).fill(0)));
  const [activePiece, setActivePiece] = useState<any>(null);
  const [pos, setPos] = useState({ x: 3, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const spawnPiece = useCallback(() => {
    const keys = Object.keys(TETROMINOS);
    const type = keys[Math.floor(Math.random() * keys.length)];
    setActivePiece(TETROMINOS[type as keyof typeof TETROMINOS]);
    setPos({ x: 3, y: 0 });
    if (checkCollision(3, 0, TETROMINOS[type as keyof typeof TETROMINOS].shape)) {
      setGameOver(true);
      setIsPaused(true);
    }
  }, [grid]);

  const checkCollision = (nx: number, ny: number, shape: number[][]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          if (!grid[ny + y] || grid[ny + y][nx + x] === undefined || grid[ny + y][nx + x] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const rotate = (matrix: number[][]) => {
    const rotated = matrix[0].map((_, index) => matrix.map(col => col[index]).reverse());
    if (!checkCollision(pos.x, pos.y, rotated)) setActivePiece({ ...activePiece, shape: rotated });
  };

  const move = (dx: number, dy: number) => {
    if (!checkCollision(pos.x + dx, pos.y + dy, activePiece.shape)) {
      setPos(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    } else if (dy > 0) {
      lockPiece();
    }
  };

  const lockPiece = () => {
    const newGrid = [...grid.map(row => [...row])];
    activePiece.shape.forEach((row: number[], y: number) => {
      row.forEach((value: number, x: number) => {
        if (value !== 0) newGrid[pos.y + y][pos.x + x] = activePiece.color;
      });
    });

    let cleared = 0;
    const filteredGrid = newGrid.filter(row => {
      if (row.every(cell => cell !== 0)) {
        cleared++;
        return false;
      }
      return true;
    });

    while (filteredGrid.length < 20) filteredGrid.unshift(Array(10).fill(0));
    setGrid(filteredGrid);
    setScore(s => s + (cleared * 100));
    spawnPiece();
  };

  useEffect(() => {
    if (isPaused || gameOver) return;
    const interval = setInterval(() => move(0, 1), 800);
    return () => clearInterval(interval);
  }, [pos, isPaused, gameOver, activePiece]);

  useEffect(() => { spawnPiece(); }, []);

  const resetGame = () => {
    setGrid(Array(20).fill(null).map(() => Array(10).fill(0)));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    spawnPiece();
  };

  return (
    <div className="bg-slate-900 p-6 rounded-[2.5rem] shadow-2xl border border-white/10 max-w-sm mx-auto overflow-hidden">
      <div className="flex justify-between items-center mb-4 text-left">
        <div>
          <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest">Enfoque Terapéutico</h4>
          <p className="text-white/40 text-[9px] uppercase font-bold">Tetris Sanatorio Aconcagua</p>
        </div>
        <div className="bg-emerald-900/50 px-3 py-1 rounded-full text-emerald-400 font-black text-xs">Score: {score}</div>
      </div>
      <div className="relative aspect-[1/2] bg-black/40 rounded-xl overflow-hidden border border-white/5">
        <div className="grid grid-cols-10 h-full">
          {grid.map((row, y) => row.map((cell, x) => {
            let color = cell || 'bg-transparent';
            if (activePiece && !isPaused && !gameOver) {
              const py = y - pos.y;
              const px = x - pos.x;
              if (py >= 0 && py < activePiece.shape.length && px >= 0 && px < activePiece.shape[0].length) {
                if (activePiece.shape[py][px]) color = activePiece.color;
              }
            }
            return <div key={`${y}-${x}`} className={`${color} border-[0.5px] border-white/5 transition-colors duration-100 rounded-[2px]`}></div>;
          }))}
        </div>
        {(isPaused || gameOver) && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <Gamepad2 size={40} className="text-emerald-400 mb-4" />
            <h5 className="text-white font-black text-lg mb-2">{gameOver ? 'Sesión Terminada' : 'Pausa Terapéutica'}</h5>
            <p className="text-white/60 text-xs mb-6">Ayuda a reducir la ansiedad durante la espera.</p>
            <button onClick={gameOver ? resetGame : () => setIsPaused(false)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all">
              {gameOver ? 'Reiniciar' : 'Continuar'}
            </button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-4 gap-2 mt-4">
        <button onClick={() => move(-1, 0)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white flex justify-center"><ArrowLeft size={18}/></button>
        <button onClick={() => move(0, 1)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white flex justify-center"><ArrowDown size={18}/></button>
        <button onClick={() => move(1, 0)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 text-white flex justify-center"><ArrowRight size={18}/></button>
        <button onClick={() => rotate(activePiece.shape)} className="p-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 text-white flex justify-center"><RotateCcw size={18}/></button>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---
const App: React.FC = () => {
  const adminRef = useRef<HTMLElement>(null);
  const hospitalRef = useRef<HTMLElement>(null);
  const prepRef = useRef<HTMLElement>(null);
  const staffRef = useRef<HTMLElement>(null);
  const mentalRef = useRef<HTMLElement>(null);
  const aprossRef = useRef<HTMLElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const QUICK_ACTIONS = [
    { label: 'Horarios Judith', icon: <Clock size={20}/>, color: 'hover:bg-emerald-50', ref: adminRef },
    { label: 'Hospital De día', icon: <Activity size={20}/>, color: 'hover:bg-blue-50', ref: hospitalRef },
    { label: 'Preparación Sesión', icon: <Coffee size={20}/>, color: 'hover:bg-amber-50', ref: prepRef },
    { label: 'Staff médico', icon: <Stethoscope size={20}/>, color: 'hover:bg-rose-50', ref: staffRef },
    { label: 'Salud mental', icon: <Brain size={20}/>, color: 'hover:bg-indigo-50', ref: mentalRef },
  ];

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col selection:bg-emerald-100 font-sans text-slate-900 overflow-x-hidden">
      
      {/* NAVEGACIÓN SUPERIOR */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <button onClick={() => window.open("https://prestadores.pami.org.ar/", "_blank")} className="flex items-center space-x-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full transition-all group shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600"></span>
            </span>
            <span className="text-[9px] font-black text-orange-800 uppercase tracking-widest">PAMI</span>
            <ExternalLink size={12} className="text-orange-400" />
          </button>

          <button onClick={() => scrollTo(aprossRef)} className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full group shadow-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Guía APROSS</span>
            <ChevronRight size={14} className="text-emerald-400" />
          </button>
        </div>
      </div>

      {/* HEADER CON BOTONES DE ACCESO DIRECTO */}
      <header className="bg-emerald-900 pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-900 shadow-2xl">
              <Activity size={48} />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight">HOSPITAL DE DÍA</h2>
          <p className="text-emerald-100 text-lg mb-12 opacity-90 max-w-2xl mx-auto font-medium italic">"Acepta las cosas que no puedes cambiar, ten el valor de cambiar las cosas que puedes y ten la sabiduría para conocer la diferencia.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 max-w-5xl mx-auto mb-16">
            {QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                onClick={() => scrollTo(action.ref)}
                className={`flex flex-col items-center text-center p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] text-white transition-all hover:scale-105 active:scale-95 group ${action.color}`}
              >
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-emerald-900 transition-colors">
                  {action.icon}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{action.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-12">
            <div className="flex items-center justify-center space-x-3 mb-6 text-emerald-300">
              <Gamepad2 size={24} />
              <h3 className="text-sm font-black uppercase tracking-widest">Pausa Terapéutica</h3>
            </div>
            <Tetris />
            <p className="mt-4 text-emerald-100/40 text-[9px] font-bold uppercase tracking-widest">Actividad para reducir la ansiedad (Con fines terapéuticos)</p>
          </div>
        </div>
      </header>

      {/* SECCIÓN ADMINISTRACIÓN */}
      <section ref={adminRef} className="py-24 px-6 bg-white scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-[#fdfbf7] p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-sm inline-block w-full">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mb-10 mx-auto"><Clock size={32} /></div>
            <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Administración</h2>
            <h4 className="text-2xl font-black text-emerald-700 mb-8">Judith Ponce</h4>
            <ul className="space-y-6 flex flex-col items-center">
              <li className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600"><Clock size={18} /></div>
                <p className="font-bold text-slate-700">Lunes a Viernes: 08:00 a 16:00 hs</p>
              </li>
              <li className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-emerald-600"><MapPin size={18} /></div>
                <p className="font-bold text-slate-700">Segundo Piso - Admisión Hospital de Día</p>
              </li>
            </ul>
            <div className="mt-10 p-6 bg-white rounded-3xl border border-emerald-50 text-slate-500 font-medium text-sm leading-relaxed italic max-w-md mx-auto">
              "Judith gestiona todos los turnos del staff médico y las autorizaciones para el Hospital de Día."
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN HOSPITAL DE DÍA */}
      <section ref={hospitalRef} className="py-24 px-6 bg-blue-50/30 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Hospital de Día</h2>
            <p className="text-blue-700 font-black uppercase text-[10px] tracking-widest">Servicios Asistenciales</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-blue-50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Activity size={24}/></div>
              <h5 className="font-black mb-4 uppercase text-xs tracking-widest">Quimioterapia</h5>
              <p className="text-sm text-slate-500 font-medium">Administración de tratamientos oncológicos en un entorno controlado y seguro.</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-blue-50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6"><ShieldCheck size={24}/></div>
              <h5 className="font-black mb-4 uppercase text-xs tracking-widest">Soporte Médico</h5>
              <p className="text-sm text-slate-500 font-medium">Monitorización constante durante todo el proceso de infusión por staff especializado.</p>
            </div>
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-blue-50">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6"><ClipboardList size={24}/></div>
              <h5 className="font-black mb-4 uppercase text-xs tracking-widest">Tratamientos</h5>
              <p className="text-sm text-slate-500 font-medium">Hidratación, medicación de soporte y otros cuidados integrales del paciente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN PREPARACIÓN */}
      <section ref={prepRef} className="py-24 px-6 bg-white scroll-mt-20">
        <div className="max-w-4xl mx-auto bg-slate-900 text-white rounded-[4rem] p-12 md:p-20 overflow-hidden relative shadow-2xl">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-12 uppercase tracking-tight text-center">Preparación para tu Sesión</h2>
            <div className="grid gap-6">
              {[
                "Hidratarse bien el día previo (mínimo 2 litros).",
                "Comer liviano antes de venir (arroz, pollo, banana).",
                "Traer ropa cómoda y si lo desea, una manta personal.",
                "Traer carnet de obra social y pedido médico original.",
                "Uso obligatorio de auriculares para dispositivos móviles."
              ].map((text, i) => (
                <div key={i} className="flex items-start space-x-6 p-6 bg-white/5 border border-white/10 rounded-3xl group hover:bg-white/10 transition-colors">
                  <CheckCircle2 className="text-emerald-400 shrink-0" size={24} />
                  <p className="font-medium text-emerald-50/90 leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN STAFF MÉDICO */}
      <section ref={staffRef} className="py-24 px-6 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Staff de Oncología</h2>
            <div className="w-20 h-1.5 bg-emerald-700 mx-auto rounded-full"></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="bg-[#fdfbf7] p-10 rounded-[2.5rem] border border-slate-100 text-center hover:bg-emerald-50 transition-all group shadow-sm hover:shadow-xl duration-300">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-inner border-4 border-white">
                  <UserCircle size={48} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">{doc.name}</h4>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-10">{doc.specialty}</p>
                <a href="https://forms.gle/ddstx18jrp8MpjmX8" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-white text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-sm">Pedir Turno</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN SALUD MENTAL */}
      <section ref={mentalRef} className="py-24 px-6 bg-indigo-50/40 scroll-mt-20">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-indigo-200"><Brain size={32} /></div>
            <h2 className="text-4xl font-black text-slate-900 mb-6 uppercase tracking-tight">Salud Mental</h2>
            <h4 className="text-2xl font-black text-indigo-700 mb-4">Mgter. Altieri Aufranc</h4>
            <p className="text-lg text-slate-600 font-medium leading-relaxed mb-10">
              Especialista en Terapia de Aceptación y Compromiso (ACT) y Musicoterapia. 
              El cuidado emocional es una parte integral de nuestro tratamiento oncológico.
            </p>
            <button onClick={() => window.open("https://forms.gle/ddstx18jrp8MpjmX8", "_blank")} className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Solicitar Acompañamiento</button>
          </div>
          <div className="bg-indigo-700 p-16 rounded-[4rem] text-center flex flex-col items-center justify-center text-white shadow-2xl">
            <Heart size={64} className="mb-8 text-indigo-300" />
            <p className="text-3xl font-black italic leading-tight">"Sanar es un proceso<br/>que involucra<br/>mente y corazón."</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN APROSS */}
      <section ref={aprossRef} className="py-24 px-6 bg-white border-y border-slate-100 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-10 text-emerald-700">
            <Bell size={32} className="animate-bounce" />
            <h2 className="text-3xl font-black uppercase tracking-tight">Empadronamiento APROSS</h2>
          </div>
          <div className="bg-white rounded-[3rem] shadow-xl border border-emerald-100 p-12 md:p-16">
            <p className="text-lg text-slate-600 font-medium mb-12 leading-relaxed">
              Es vital estar empadronado para recibir los medicamentos en tiempo y forma. 
              Recuerda realizar el trámite a través de "Mi Portal APROSS" cargando los informes médicos actualizados.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest block mb-4">Paso 1</span>
                <p className="font-bold text-slate-900">Ingresar a la web oficial con CIDI o credencial.</p>
              </div>
              <div className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100">
                <span className="text-xs font-black text-emerald-700 uppercase tracking-widest block mb-4">Paso 2</span>
                <p className="font-bold text-slate-900 text-emerald-900">Adjuntar pedido médico y estudios de diagnóstico.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 bg-[#0a1210] text-white/50 text-center">
        <div className="max-w-5xl mx-auto">
          <Activity size={48} className="text-emerald-700 mx-auto mb-10" />
          <p className="text-[12px] font-black uppercase tracking-[0.4em] mb-12">Hospital de Día & Fundación Claudio Dubersarsky</p>
          
          {/* BOTONES INSTITUCIONALES SOLICITADOS */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-16">
            <button 
              onClick={() => window.open("https://fundacionclaudiodubersarsky.com.ar/", "_blank")}
              className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl transition-all group min-w-[280px] justify-center"
            >
              <HandHelping size={20} className="text-emerald-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Fundación Claudio Dubersarsky</span>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <button 
              onClick={() => window.open("https://campanitaescueladepacientes.com.ar/", "_blank")}
              className="flex items-center space-x-3 bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl transition-all group min-w-[280px] justify-center"
            >
              <School size={20} className="text-blue-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Campanita Escuela de Pacientes</span>
              <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>

          <div className="pt-10 border-t border-white/5 text-[10px] tracking-widest font-bold uppercase">
            © 2026 HOSPITAL DE DÍA. SANATORIO ACONCAGUA.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
