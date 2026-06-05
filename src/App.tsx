// src/App.tsx
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
  { id: 'dashboard', label: 'Dashboard'   },
  { id: 'team',      label: 'Equipo'      },
  { id: 'pc',        label: 'PC Box'      },
  { id: 'cemetery',  label: 'Cementerio'  },
  { id: 'simulator', label: 'Simulador'   },
  { id: 'bag',       label: 'Mochila'     },
];

export default function App() {
  const theme     = useGameStore(s => s.settings.theme);
  const activeTab = useUIStore(s => s.activeTab);
  const setTab    = useUIStore(s => s.setActiveTab);

  useEffect(() => {
    document.documentElement.className = `theme-${theme} dark`;
  }, [theme]);

 const renderTab = () => {
  switch (activeTab) {
    case 'dashboard':  return <Dashboard />;
    case 'team':       return <ActiveTeam />;
    case 'pc':         return <PCBox />;
    case 'cemetery':   return <Cemetery />;
    case 'pokedex':    return <Pokedex />;
    case 'simulator':  return <TeamSimulator />;
    case 'bag':        return <Bag />;
    default:           return <Dashboard />;
  }
};

  return (
    <div className={`theme-${theme} min-h-screen bg-gray-950 p-2 md:p-4`}>
      <div className="max-w-screen-2xl mx-auto">
        {/* Carcasa principal Pokédex */}
        <div className="pokedex-shell p-3 md:p-4">
          {/* LEDs decorativos */}
          <div className="flex items-center gap-2 mb-3">
            <div className="led led-blue w-12 h-12 rounded-full border-4 border-white/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-white/30" />
            </div>
            <div className="led led-red" />
            <div className="led led-yellow" />
            <div className="led led-green" />
          </div>

          {/* TopBar */}
          <TopBar />

          {/* Pantalla principal — dividida en 2 columnas en desktop */}
          <div className="pokedex-screen mt-3 p-1">
            <div className="flex flex-col lg:flex-row gap-0 lg:divide-x lg:divide-white/10">

              {/* ── Columna izquierda: Navegación + contenido ── */}
              <div className="flex-1 min-w-0 flex flex-col">
                {/* Tabs */}
                <div className="flex flex-wrap gap-1 p-2 bg-black/20">
                  {TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setTab(tab.id)}
                      className={`poke-btn text-xs px-2 py-1 transition-all ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white border border-white/30'
                          : 'bg-black/30 text-white/60 border border-transparent hover:text-white/90'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Contenido */}
                <div className="p-3 min-h-[500px]">
                  <TabContent key={activeTab}>
                    {renderTab()}
                  </TabContent>
                </div>
              </div>

              {/* ── Columna derecha: Pokédex permanente ── */}
              <div className="lg:w-[480px] xl:w-[520px] flex-shrink-0 border-t border-white/10 lg:border-t-0">
                <div className="p-3 h-full">
                  <Pokedex />
                </div>
              </div>

            </div>
          </div>

          {/* Botones decorativos inferiores */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-black/40 border border-white/10" />
              <div className="w-8 h-3 rounded bg-black/40 border border-white/10 self-center" />
            </div>
            <div className="flex gap-1">
              {['A','B','C','D'].map(l => (
                <div key={l} className="w-6 h-6 rounded-full bg-black/40 border border-white/10 flex items-center justify-center">
                  <span className="text-white/30 text-xs">{l}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
        }}
      />
    </div>
  );
}

function TabContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}