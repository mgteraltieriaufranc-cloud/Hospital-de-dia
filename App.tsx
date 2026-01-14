import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  X,
  Stethoscope,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Gamepad2,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  RotateCcw,
  // Fix: Added missing Bell import from lucide-react
  Bell
} from 'lucide-react';
import { getSmartOrientation } from './services/geminiService';

// --- CONSTANTES ---
const DOCTORS = [
  { name: 'Dr. Dubersarsky', specialty: 'Oncología Clínica' },
  { name: 'Dr. Ortiz', specialty: 'Oncología Clínica' },
  { name: 'Dra. Di Sisto', specialty: 'Oncología Clínica' },
  { name: 'Dra. Miranda', specialty: 'Oncología Clínica' },
];

const QUICK_ACTIONS = [
  { label: 'Horarios Judith', query: '¿En qué horario atiende Judith Ponce?', icon: <Clock size={14}/> },
  { label: 'Hospital De día', query: '¿Qué servicios ofrece el Hospital de Día?', icon: <Activity size={14}/> },
  { label: 'Preparación Sesión', query: '¿Qué debo hacer antes de mi quimioterapia?', icon: <Coffee size={14}/> },
  { label: 'Staff médico', query: '¿Quiénes son los oncólogos?', icon: <Stethoscope size={14}/> },
  { label: 'Salud mental', query: '¿Turno con el Terapeuta Altieri?', icon: <Brain size={14}/> },
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
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="text-emerald-400 font-black text-xs uppercase tracking-widest">Enfoque Terapéutico</h4>
          <p className="text-white/40 text-[9px] uppercase font-bold">Tetris Sanatorio Aconcagua</p>
        </div>
        <div className="bg-emerald-900/50 px-3 py-1 rounded-full text-emerald-400 font-black text-xs">
          Score: {score}
        </div>
      </div>

      <div className="relative aspect-[1/2] bg-black/40 rounded-xl overflow-hidden border border-white/5">
        <div className="grid grid-cols-10 h-full">
          {grid.map((row, y) => row.map((cell, x) => {
            let color = cell || 'bg-transparent';
            // Dibujar pieza activa
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
            <p className="text-white/60 text-xs mb-6">Este juego ayuda a reducir la ansiedad y mejorar el enfoque cognitivo.</p>
            <button 
              onClick={gameOver ? resetGame : () => setIsPaused(false)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all"
            >
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
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const searchSectionRef = useRef<HTMLElement>(null);
  const aprossSectionRef = useRef<HTMLElement>(null);

  const handleSearch = async (e?: React.FormEvent, manualQuery?: string) => {
    if (e) e.preventDefault();
    const finalQuery = (manualQuery || query).trim();
    if (!finalQuery) return;
    
    setIsLoading(true);
    setError(null);
    setAiResponse(null);
    
    try {
      const response = await getSmartOrientation(finalQuery);
      setAiResponse(response);
    } catch (err) {
      console.error("Search Error:", err);
      setError("Error de conexión con el asistente. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        document.getElementById('result-target')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col selection:bg-emerald-100 font-sans text-slate-900">
      
      {/* NAVEGACIÓN COMPATIBLE CON GOOGLE SITES */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <button 
            onClick={() => window.open("https://prestadores.pami.org.ar/", "_blank")}
            className="flex items-center space-x-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full transition-all group"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-600"></span>
            </span>
            <span className="text-[9px] font-black text-orange-800 uppercase tracking-widest">PAMI Prestadores</span>
            <ExternalLink size={12} className="text-orange-400" />
          </button>

          <button 
            onClick={() => aprossSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full group"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
            </span>
            <span className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">Guía APROSS</span>
            <ChevronRight size={14} className="text-emerald-400" />
          </button>
        </div>
      </div>

      <header ref={searchSectionRef} className="bg-emerald-900 pt-16 pb-20 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-900 shadow-2xl">
              <BrainCircuit size={40} />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-6 uppercase tracking-tight">Buscador Inteligente</h2>
          
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="relative group mb-6">
              {isLoading && (
                <div className="absolute -top-1 left-0 right-0 h-1 bg-emerald-400 overflow-hidden rounded-full z-20">
                  <div className="h-full bg-white animate-[loading_1s_infinite] w-1/2"></div>
                </div>
              )}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                <Search size={24} />
              </div>
              <input
                type="text"
                placeholder="Pregunta sobre turnos, horarios o preparativos..."
                className="w-full pl-16 pr-32 py-7 bg-white border-none rounded-[2rem] shadow-2xl text-lg font-medium outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading}
                className="absolute right-3 top-3 bottom-3 bg-emerald-700 hover:bg-emerald-800 text-white px-8 rounded-[1.5rem] transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                <span className="font-bold">Buscar</span>
              </button>
            </form>

            <div className="flex flex-wrap gap-2 justify-center">
              {QUICK_ACTIONS.map((action, idx) => (
                <button
                  key={idx}
                  onClick={() => { setQuery(action.query); handleSearch(undefined, action.query); }}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div id="result-target" className="scroll-mt-24">
            {error && (
              <div className="bg-red-50 p-6 rounded-3xl border border-red-200 text-red-800 flex items-center space-x-4 max-w-lg mx-auto mb-8">
                <AlertCircle size={24} className="shrink-0" />
                <p className="font-bold text-sm text-left">{error}</p>
                <button onClick={() => handleSearch()} className="p-2 bg-white rounded-full shadow-sm"><RefreshCw size={14}/></button>
              </div>
            )}

            {aiResponse && (
              <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden text-left max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-emerald-700 font-black text-[10px] uppercase tracking-widest">
                    <BookOpen size={16} />
                    <span>Respuesta del Asistente</span>
                  </div>
                  <button onClick={() => setAiResponse(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                </div>
                <div className="p-10">
                  <p className="text-slate-700 text-lg leading-relaxed font-medium whitespace-pre-wrap">{aiResponse}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* SECCIÓN TETRIS TERAPÉUTICO */}
          <div className="mt-20">
            <div className="flex items-center justify-center space-x-3 mb-8 text-emerald-300">
              <Gamepad2 size={24} />
              <h3 className="text-xl font-black uppercase tracking-widest">Relajación Terapéutica</h3>
            </div>
            <Tetris />
            <p className="mt-6 text-emerald-100/50 text-[10px] font-bold uppercase tracking-[0.2em]">
              Usa el Tetris para reducir el estrés durante la espera. <br/> 
              Recomendado con fines de relajación cognitiva.
            </p>
          </div>
        </div>
      </header>

      {/* SECCIONES DE CONTENIDO - DISEÑO MINIMALISTA */}
      <section id="staff" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-black text-slate-900 mb-16 uppercase text-center">Staff Médico</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {DOCTORS.map((doc, i) => (
              <div key={i} className="bg-[#fdfbf7] p-10 rounded-[2.5rem] border border-slate-100 text-center hover:bg-emerald-50 transition-all group shadow-sm">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 group-hover:bg-emerald-700 group-hover:text-white transition-all shadow-inner border-4 border-white">
                  <UserCircle size={48} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-2">{doc.name}</h4>
                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-10">{doc.specialty}</p>
                <a href="https://forms.gle/ddstx18jrp8MpjmX8" target="_blank" rel="noopener noreferrer" className="block w-full py-4 bg-white text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-200 group-hover:bg-emerald-700 group-hover:text-white transition-all">Pedir Turno</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={aprossSectionRef} className="py-24 px-6 bg-indigo-50/30 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-10 text-indigo-700">
            <Bell size={32} />
            <h2 className="text-3xl font-black uppercase tracking-tight">Empadronamiento APROSS</h2>
          </div>
          <div className="bg-white rounded-[3rem] shadow-xl border border-indigo-100 p-12 overflow-hidden">
            <p className="text-lg text-slate-600 font-medium mb-12">Paso 1: Portal APROSS. Paso 2: Sube estudios y pedido médico. Paso 3: Espera estado "Empadronado".</p>
            <div className="bg-indigo-900 text-white p-8 rounded-3xl flex items-center space-x-6">
              <Info size={32} className="text-indigo-300 shrink-0" />
              <p className="text-sm font-bold italic">"Consultar a Judith Ponce si tienes dudas técnicas con el portal."</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-24 px-6 bg-[#0a1210] text-white/50 text-center">
        <div className="max-w-5xl mx-auto">
          <Activity size={48} className="text-emerald-700 mx-auto mb-10" />
          <p className="text-[12px] font-black uppercase tracking-[0.4em] mb-10">Hospital de Día & Fundación Claudio Dubersarsky</p>
          <div className="mt-20 pt-10 border-t border-white/5 text-[10px] tracking-widest font-bold uppercase">© 2026 HOSPITAL DE DÍA. TODOS LOS DERECHOS RESERVADOS.</div>
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