
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
  Bell,
  MessageSquare
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
  { label: 'Horarios Judith', query: '¿En qué horario atiende Judith Ponce?', icon: <Clock size={20}/>, color: 'hover:border-emerald-500 hover:bg-emerald-50' },
  { label: 'Hospital De día', query: '¿Qué servicios ofrece el Hospital de Día?', icon: <Activity size={20}/>, color: 'hover:border-blue-500 hover:bg-blue-50' },
  { label: 'Preparación Sesión', query: '¿Qué debo hacer antes de mi quimioterapia?', icon: <Coffee size={20}/>, color: 'hover:border-amber-500 hover:bg-amber-50' },
  { label: 'Staff médico', query: '¿Quiénes son los oncólogos?', icon: <Stethoscope size={20}/>, color: 'hover:border-rose-500 hover:bg-rose-50' },
  { label: 'Salud mental', query: '¿Turno con el Terapeuta Altieri?', icon: <Brain size={20}/>, color: 'hover:border-indigo-500 hover:bg-indigo-50' },
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
        <div className="bg-emerald-900/50 px-3 py-1 rounded-full text-emerald-400 font-black text-xs">
          Score: {score}
        </div>
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
            <p className="text-white/60 text-xs mb-6">Este juego ayuda a reducir la ansiedad durante la espera.</p>
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
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  
  const aprossSectionRef = useRef<HTMLElement>(null);

  const handleQuickAction = async (action: { label: string, query: string }) => {
    setActiveQuery(action.label);
    setIsLoading(true);
    setError(null);
    setAiResponse(null);
    
    try {
      const response = await getSmartOrientation(action.query);
      setAiResponse(response);
    } catch (err) {
      console.error("Action Error:", err);
      setError("No se pudo conectar con el asistente. Por favor, reintenta pulsando el botón de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const closePortal = () => {
    setAiResponse(null);
    setError(null);
    setIsLoading(false);
    setActiveQuery(null);
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] flex flex-col selection:bg-emerald-100 font-sans text-slate-900 overflow-x-hidden">
      
      {/* NAVEGACIÓN */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <button 
            onClick={() => window.open("https://prestadores.pami.org.ar/", "_blank")}
            className="flex items-center space-x-2 bg-orange-50 border border-orange-200 px-4 py-2 rounded-full transition-all group shadow-sm"
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
            className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full group shadow-sm"
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

      {/* HEADER Y ASISTENTE POR BOTONES */}
      <header className="bg-emerald-900 pt-20 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <Activity size={400} className="absolute -top-20 -right-20 text-white rotate-12" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-900 shadow-2xl">
              <BrainCircuit size={48} />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">Asistente de Orientación</h2>
          <p className="text-emerald-100 text-lg mb-16 opacity-90 max-w-2xl mx-auto font-medium">Pulsa una opción para recibir asistencia inmediata sobre nuestro Hospital de Día.</p>
          
          {/* GRILLA DE BOTONES - REEMPLAZO DEL BUSCADOR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mb-20">
            {QUICK_ACTIONS.map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className={`flex flex-col items-center text-center p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] text-white transition-all hover:scale-105 active:scale-95 group ${action.color}`}
              >
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-emerald-900 transition-colors">
                  {action.icon}
                </div>
                <span className="text-xs font-black uppercase tracking-widest leading-relaxed">{action.label}</span>
              </button>
            ))}
          </div>

          {/* SECCIÓN TETRIS TERAPÉUTICO */}
          <div className="mt-12 pt-12 border-t border-white/10">
            <div className="flex items-center justify-center space-x-3 mb-8 text-emerald-300">
              <Gamepad2 size={24} />
              <h3 className="text-xl font-black uppercase tracking-widest italic">Pausa Terapéutica</h3>
            </div>
            <Tetris />
            <p className="mt-6 text-emerald-100/50 text-[10px] font-bold uppercase tracking-[0.2em]">
              Usa este espacio para reducir el estrés (Con fines terapéuticos).
            </p>
          </div>
        </div>
      </header>

      {/* MODAL / VENTANA EMERGENTE DE RESPUESTA */}
      {(isLoading || aiResponse || error) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md" onClick={closePortal}></div>
          
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Cabecera del Modal */}
            <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-lg">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-black text-xs uppercase tracking-widest">{activeQuery || 'Consulta'}</h4>
                  <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-widest">Aconcagua Concierge</p>
                </div>
              </div>
              <button 
                onClick={closePortal}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-10 max-h-[70vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin mb-6"></div>
                  <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Consultando al asistente médico...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={32} />
                  </div>
                  <h5 className="text-xl font-black text-slate-900 mb-4 uppercase">Error de Conexión</h5>
                  <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
                  <button 
                    onClick={closePortal}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4">
                  <div className="bg-emerald-50/50 border border-emerald-100/50 p-8 rounded-[2rem] mb-8">
                    <p className="text-slate-700 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                      {aiResponse}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={closePortal}
                      className="flex-1 bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-emerald-800 shadow-xl shadow-emerald-200 transition-all flex items-center justify-center space-x-2"
                    >
                      <span>Entendido</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center justify-center">
                <Info size={12} className="mr-2" />
                Esta es una orientación informativa. Consultar siempre al staff médico.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN STAFF MÉDICO */}
      <section id="staff" className="py-24 px-6 bg-white">
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

      {/* SECCIÓN APROSS */}
      <section ref={aprossSectionRef} className="py-24 px-6 bg-indigo-50/30 border-y border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-10 text-indigo-700">
            <Bell size={32} className="animate-bounce" />
            <h2 className="text-3xl font-black uppercase tracking-tight leading-none">Empadronamiento<br/>APROSS</h2>
          </div>
          <div className="bg-white rounded-[3rem] shadow-xl border border-indigo-100 p-12 md:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <p className="text-lg text-slate-600 font-medium mb-12 leading-relaxed relative z-10">
              El trámite es fundamental para garantizar la provisión de medicamentos. 
              Recuerda tener a mano tus estudios y el pedido médico del staff del Sanatorio Aconcagua.
            </p>
            <div className="bg-indigo-900 text-white p-8 rounded-3xl flex items-center space-x-6 relative z-10">
              <Info size={32} className="text-indigo-300 shrink-0" />
              <p className="text-sm font-bold italic leading-relaxed">
                "Si tienes dudas con el portal oficial, Judith Ponce en administración te orientará sobre la documentación técnica requerida."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-24 px-6 bg-[#0a1210] text-white/50 text-center">
        <div className="max-w-5xl mx-auto">
          <Activity size={48} className="text-emerald-700 mx-auto mb-10" />
          <p className="text-[12px] font-black uppercase tracking-[0.4em] mb-10">Hospital de Día & Fundación Claudio Dubersarsky</p>
          <div className="mt-20 pt-10 border-t border-white/5 text-[10px] tracking-widest font-bold uppercase">© 2026 HOSPITAL DE DÍA. TODOS LOS DERECHOS RESERVADOS.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
