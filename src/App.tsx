import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { useUIStore } from './store/settingsStore';
import TopBar from './components/TopBar';
import Dashboard from './components/Dashboard';
import ActiveTeam from './components/ActiveTeam';
import PCBox from './components/PCBox';
import Cemetery from './components/Cemetery';
import Pokedex from './components/Pokedex';
import TeamSimulator from './components/TeamSimulator';
import Bag from './components/Bag';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'team',      label: 'Equipo' },
  { id: 'pc',        label: 'PC Box' },
  { id: 'cemetery',  label: 'Cementerio' },
  { id: 'simulator', label: 'Simulador' },
  { id: 'bag',       label: 'Mochila' },
];

const THEME_COLORS: Record<string, { primary: string; secondary: string; accent: string; shell: string }> = {
  red:    { primary: '#CC0000', secondary: '#8B0000', accent: '#ff6b6b', shell: 'linear-gradient(145deg, #CC0000, #8B0000)' },
  blue:   { primary: '#1a6bcc', secondary: '#0d4a99', accent: '#6ba3ff', shell: 'linear-gradient(145deg, #1a6bcc, #0d4a99)' },
  green:  { primary: '#2d8a4e', secondary: '#1a5c33', accent: '#5dcc8a', shell: 'linear-gradient(145deg, #2d8a4e, #1a5c33)' },
  gold:   { primary: '#c9a900', secondary: '#8f7600', accent: '#ffd700', shell: 'linear-gradient(145deg, #c9a900, #8f7600)' },
  silver: { primary: '#6a7fa0', secondary: '#4a5c78', accent: '#a8bcd4', shell: 'linear-gradient(145deg, #6a7fa0, #4a5c78)' },
  black:  { primary: '#2a2a3e', secondary: '#1a1a2e', accent: '#8888ff', shell: 'linear-gradient(145deg, #2a2a3e, #1a1a2e)' },
};

export default function App() {
  const theme     = useGameStore(s => s.settings.theme);
  const activeTab = useUIStore(s => s.activeTab);
  const setTab    = useUIStore(s => s.setActiveTab);
  const colors    = THEME_COLORS[theme] ?? THEME_COLORS.red;

  useEffect(() => {
    document.documentElement.className = `theme-${theme} dark`;
    document.documentElement.style.setProperty('--theme-primary',   colors.primary);
    document.documentElement.style.setProperty('--theme-secondary',  colors.secondary);
    document.documentElement.style.setProperty('--theme-accent',     colors.accent);
  }, [theme, colors]);

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard />;
      case 'team':       return <ActiveTeam />;
      case 'pc':         return <PCBox />;
      case 'cemetery':   return <Cemetery />;
      case 'simulator':  return <TeamSimulator />;
      case 'bag':        return <Bag />;
      default:           return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-2 md:p-3" style={{ background: '#0d1117' }}>
      <div className="max-w-screen-2xl mx-auto">

        {/* ── Carcasa Pokédex ── */}
        <div
          className="rounded-2xl p-3 md:p-4 relative overflow-hidden"
          style={{
            background: colors.shell,
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -2px 0 rgba(0,0,0,0.2)`,
          }}
        >
          {/* Reflejo superior */}
          <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
            style={{ background: 'rgba(255,255,255,0.18)' }} />

          {/* ── LEDs decorativos ── */}
          <div className="flex items-center gap-2 mb-3">
            {/* LED grande azul */}
            <div className="w-10 h-10 rounded-full border-4 border-white/20 flex items-center justify-center flex-shrink-0"
              style={{ background: 'radial-gradient(circle at 35% 35%, #88ccff, #2255cc)', boxShadow: '0 0 12px #4488ff, 0 0 24px #4488ff44' }}>
              <div className="w-5 h-5 rounded-full" style={{ background: 'rgba(255,255,255,0.35)' }} />
            </div>
            <div className="w-3 h-3 rounded-full" style={{ background: '#ff4444', boxShadow: '0 0 6px #ff4444' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#ffcc00', boxShadow: '0 0 6px #ffcc00' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: '#44ff88', boxShadow: '0 0 6px #44ff88' }} />

            {/* Línea decorativa */}
            <div className="flex-1 h-px bg-white/10 mx-2" />
            <div className="text-white/20 text-xs font-bold tracking-widest">POKÉDEX</div>
          </div>

          {/* ── TopBar ── */}
          <TopBar />

          {/* ── Pantalla principal ── */}
          <div
            className="mt-3 rounded-lg overflow-hidden"
            style={{
              background: '#0d1117',
              border: '3px solid #1a1f2e',
              boxShadow: 'inset 0 2px 16px rgba(0,0,0,0.8), inset 0 0 40px rgba(0,0,0,0.4)',
            }}
          >
            {/* ── Layout dividido ── */}
            <div className="flex flex-col lg:flex-row lg:divide-x lg:divide-white/5">

              {/* Columna izquierda */}
              <div className="flex-1 min-w-0 flex flex-col">

                {/* Tabs de navegación */}
                <div
                  className="flex flex-wrap gap-1 px-3 pt-2 pb-0"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.3)' }}
                >
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setTab(tab.id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-t-lg transition-all duration-150 select-none"
                      style={activeTab === tab.id ? {
                        background: 'rgba(255,255,255,0.1)',
                        color: '#fff',
                        borderBottom: `2px solid ${colors.accent}`,
                        boxShadow: `0 -2px 8px ${colors.accent}22`,
                      } : {
                        color: 'rgba(255,255,255,0.4)',
                        borderBottom: '2px solid transparent',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Contenido del tab */}
                <div className="p-3 min-h-[500px] overflow-y-auto">
                  <TabContent key={activeTab}>
                    {renderTab()}
                  </TabContent>
                </div>
              </div>

              {/* Columna derecha — Pokédex permanente */}
              <div className="lg:w-[440px] xl:w-[480px] flex-shrink-0 border-t border-white/5 lg:border-t-0">
                <div className="p-3 h-full">
                  <Pokedex />
                </div>
              </div>

            </div>
          </div>

          {/* ── Panel inferior decorativo ── */}
          <div className="flex items-center justify-between mt-3 px-1">
            {/* Controles izquierda */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full border-2 border-white/10"
                style={{ background: 'rgba(0,0,0,0.3)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }} />
              <div className="w-14 h-4 rounded-full border border-white/10"
                style={{ background: 'rgba(0,0,0,0.3)' }} />
            </div>

            {/* Texto inferior */}
            <div className="text-white/15 text-xs tracking-widest font-bold">
              RANDOMLOCKE TRACKER v1.0 — GAME FREAK / NINTENDO
            </div>

            {/* Botones ABCD */}
            <div className="flex gap-1.5">
              {[
                { l: 'A', c: colors.accent },
                { l: 'B', c: '#ff6666' },
                { l: 'C', c: '#ffcc44' },
                { l: 'D', c: '#44cc88' },
              ].map(({ l, c }) => (
                <div key={l}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border border-white/10"
                  style={{ background: 'rgba(0,0,0,0.4)', color: c, textShadow: `0 0 6px ${c}` }}>
                  {l}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1a1f2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'Nunito, sans-serif',
            fontSize: '13px',
          }
        }}
      />
    </div>
  );
}

function TabContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.div>
  );
}