import { useState } from 'react';
import { Settings, Download, Upload, Volume2, VolumeX, Palette } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { downloadJSON } from '../utils/exportImport';
import { readJSONFile } from '../utils/exportImport';
import toast from 'react-hot-toast';

const THEMES = [
  { id: 'red',    label: 'Rojo Clásico', color: '#CC0000' },
  { id: 'blue',   label: 'Azul Zafiro',  color: '#1a6bcc' },
  { id: 'green',  label: 'Verde Hoja',   color: '#2d8a4e' },
  { id: 'gold',   label: 'Oro',          color: '#c9a900' },
  { id: 'silver', label: 'Plata',        color: '#6a7fa0' },
  { id: 'black',  label: 'Negro Mate',   color: '#2a2a3e' },
] as const;

const GAMES = [
  'red','blue','yellow','gold','silver','crystal',
  'ruby','sapphire','emerald','firered','leafgreen',
  'diamond','pearl','platinum','heartgold','soulsilver',
  'black','white','black2','white2',
  'x','y','omegaruby','alphasapphire',
  'sun','moon','ultrasun','ultramoon',
  'sword','shield','scarlet','violet',
];

export default function TopBar() {
  const settings       = useGameStore(s => s.settings);
  const updateSettings = useGameStore(s => s.updateSettings);
  const exportGame     = useGameStore(s => s.exportGame);
  const importGame     = useGameStore(s => s.importGame);

  const [showConfig,  setShowConfig]  = useState(false);
  const [showThemes,  setShowThemes]  = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput,   setNameInput]   = useState(settings.gameName);

  const handleExport = () => {
    const data = exportGame();
    downloadJSON(JSON.parse(data), `randomlocke-${settings.gameName}-${Date.now()}.json`);
    toast.success('¡Partida exportada!');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await readJSONFile(file);
      importGame(JSON.stringify(data));
      toast.success('¡Partida importada!');
    } catch {
      toast.error('Error al importar el archivo');
    }
  };

  const handleNameSave = () => {
    updateSettings({ gameName: nameInput });
    setEditingName(false);
    toast.success('Nombre actualizado');
  };

  return (
    <div className="relative">
      {/* Barra principal */}
      <div className="flex items-center justify-between gap-2 bg-black/30 rounded-lg px-3 py-2 border border-white/10">

        {/* Logo + Nombre */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo Pokédex */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
            <span className="text-lg">🎮</span>
          </div>

          {/* Nombre de partida */}
          <div className="min-w-0">
            {editingName ? (
              <div className="flex items-center gap-1">
                <input
                  className="bg-black/50 text-white text-sm rounded px-2 py-0.5 border border-white/20 outline-none w-36"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleNameSave(); if (e.key === 'Escape') setEditingName(false); }}
                  autoFocus
                />
                <button onClick={handleNameSave} className="text-green-400 text-xs px-1">✓</button>
                <button onClick={() => setEditingName(false)} className="text-red-400 text-xs px-1">✗</button>
              </div>
            ) : (
              <button
                onClick={() => { setEditingName(true); setNameInput(settings.gameName); }}
                className="text-white font-bold text-sm truncate hover:text-yellow-300 transition-colors text-left"
              >
                {settings.gameName}
              </button>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-white/50 text-xs capitalize">{settings.gameVersion}</span>
              <span className="text-white/30 text-xs">•</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full text-white/80"
                style={{ background: THEMES.find(t => t.id === settings.theme)?.color + '44' }}
              >
                {THEMES.find(t => t.id === settings.theme)?.label}
              </span>
            </div>
          </div>
        </div>

        {/* Controles derechos */}
        <div className="flex items-center gap-1 flex-shrink-0">

          {/* Sonido */}
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-2 rounded-lg bg-black/20 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title={settings.soundEnabled ? 'Silenciar' : 'Activar sonido'}
          >
            {settings.soundEnabled
              ? <Volume2 size={16} />
              : <VolumeX size={16} className="text-red-400" />
            }
          </button>

          {/* Temas */}
          <button
            onClick={() => { setShowThemes(!showThemes); setShowConfig(false); }}
            className="p-2 rounded-lg bg-black/20 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Cambiar tema"
          >
            <Palette size={16} />
          </button>

          {/* Exportar */}
          <button
            onClick={handleExport}
            className="p-2 rounded-lg bg-black/20 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Exportar partida"
          >
            <Download size={16} />
          </button>

          {/* Importar */}
          <label className="p-2 rounded-lg bg-black/20 hover:bg-white/10 transition-colors text-white/70 hover:text-white cursor-pointer" title="Importar partida">
            <Upload size={16} />
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>

          {/* Configuración */}
          <button
            onClick={() => { setShowConfig(!showConfig); setShowThemes(false); }}
            className="p-2 rounded-lg bg-black/20 hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            title="Configuración"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Panel de temas */}
      {showThemes && (
        <div className="absolute right-0 top-14 z-50 bg-gray-900 border border-white/20 rounded-xl p-3 shadow-2xl w-64">
          <p className="text-white/60 text-xs mb-2 font-bold uppercase tracking-wider">Tema de color</p>
          <div className="grid grid-cols-2 gap-2">
            {THEMES.map(theme => (
              <button
                key={theme.id}
                onClick={() => { updateSettings({ theme: theme.id as typeof settings.theme }); setShowThemes(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm ${
                  settings.theme === theme.id
                    ? 'border-white/40 bg-white/10 text-white'
                    : 'border-white/10 bg-black/20 text-white/60 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: theme.color }} />
                <span className="truncate text-xs">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Panel de configuración */}
      {showConfig && (
        <div className="absolute right-0 top-14 z-50 bg-gray-900 border border-white/20 rounded-xl p-4 shadow-2xl w-72">
          <p className="text-white/60 text-xs mb-3 font-bold uppercase tracking-wider">Configuración</p>

          {/* Juego */}
          <div className="mb-3">
            <label className="text-white/50 text-xs block mb-1">Juego</label>
            <select
              className="w-full bg-black/40 text-white text-sm rounded-lg px-3 py-2 border border-white/10 outline-none capitalize"
              value={settings.gameVersion}
              onChange={e => updateSettings({ gameVersion: e.target.value as typeof settings.gameVersion })}
            >
              {GAMES.map(g => (
                <option key={g} value={g} className="capitalize">{g}</option>
              ))}
            </select>
          </div>

          {/* Tokens de resurrección */}
          <div className="mb-3">
            <label className="text-white/50 text-xs block mb-1">Tokens de resurrección</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => useGameStore.getState().useResurrectionToken()}
                className="w-8 h-8 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-white font-bold transition-colors"
              >−</button>
              <span className="text-white font-bold text-lg flex-1 text-center">
                {settings.resurrectionTokens} 🪙
              </span>
              <button
                onClick={() => useGameStore.getState().addResurrectionToken()}
                className="w-8 h-8 rounded-lg bg-green-900/40 hover:bg-green-900/60 text-white font-bold transition-colors"
              >+</button>
            </div>
          </div>

          {/* Wipes */}
          <div className="mb-3">
            <label className="text-white/50 text-xs block mb-1">Contador de Wipes</label>
            <div className="flex items-center gap-2">
              <span className="text-white font-bold text-lg flex-1">
                💀 {settings.wipeCount} wipes
              </span>
              <button
                onClick={() => useGameStore.getState().incrementWipe()}
                className="px-3 py-1 rounded-lg bg-red-900/40 hover:bg-red-900/60 text-white text-sm transition-colors"
              >+1</button>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              if (confirm('¿Resetear toda la partida? Esta acción no se puede deshacer.')) {
                useGameStore.getState().resetGame();
                toast.success('Partida reseteada');
                setShowConfig(false);
              }
            }}
            className="w-full mt-2 py-2 rounded-lg bg-red-900/30 hover:bg-red-900/50 text-red-400 text-sm font-bold transition-colors border border-red-900/30"
          >
            🗑️ Resetear partida
          </button>
        </div>
      )}
    </div>
  );
}