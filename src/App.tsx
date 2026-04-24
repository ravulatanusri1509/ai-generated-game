import { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion, AnimatePresence } from 'motion/react';
import { Github, Trophy, Cpu, Activity } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) setHighScore(newScore);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden border-4 border-[#1a1a1a] relative">
      {/* Visual FX Layers */}
      <div className="scanline" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[99] bg-[url('https://grain-y.com/images/grain.png')] bg-repeat" />

      {/* Header */}
      <header className="h-[70px] shrink-0 border-b border-[#222] flex items-center justify-between px-8 bg-[#0a0a0a]/80 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center">
            <Cpu className="text-[#00f3ff] w-6 h-6 drop-shadow-[0_0_8px_#00f3ff]" />
          </div>
          <h1 
            data-text="SYNTH-ARCADE // v.10"
            className="glitch-text font-mono font-extrabold text-xl tracking-[2px] text-[#00f3ff] drop-shadow-[0_0_10px_#00f3ff]"
          >
            SYNTH-ARCADE // v.10
          </h1>
        </div>
        <div className="flex gap-5 text-xs font-mono uppercase">
          <span className="text-[#00f3ff] animate-pulse">CONNECTION: ESTABLISHED</span>
          <span className="text-[#888888]">NODE_ID: 0x867838</span>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 grid grid-cols-[280px_1fr] overflow-hidden relative z-10">
        {/* Sidebar */}
        <aside className="border-r border-[#222] bg-[#111] p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
          <div>
            <h3 className="text-[10px] font-mono uppercase tracking-[3px] text-[#888888] mb-6">// DATA_STREAM_LIBRARY</h3>
            <div className="flex flex-col gap-3">
              {['Midnight Protocol', 'Neon Horizon', 'Carbon Fiber'].map((track, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    i === 0 
                      ? 'border-[#ff00ff] bg-[#ff00ff]/10 shadow-[0_0_10px_rgba(255,0,255,0.2)]' 
                      : 'border-[#222] bg-white/2 hover:bg-white/5'
                  }`}
                >
                  <div className="text-sm font-bold mb-1 uppercase tracking-tight">{track}</div>
                  <div className="text-[10px] text-[#888888] font-mono">ENCODED_BY: CYBER_DRIVE</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto">
            <div className="p-4 bg-[#00f3ff]/5 rounded-lg border border-dashed border-[#00f3ff] relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyan-500/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <p className="text-[10px] text-[#00f3ff] uppercase mb-1 font-mono tracking-widest font-black">ACTIVE_BOUNTY</p>
              <p className="text-xs text-white/70 font-mono leading-tight">
                // OBJECTIVE: SEQUENCE {Math.max(50, score + 10)} NODES.<br/>
                // STATUS: NO_COLLISION_PERMITTED.
              </p>
            </div>
          </div>
        </aside>

        {/* Game Area */}
        <section className="relative flex items-center justify-center bg-[radial-gradient(circle_at_center,#111_0%,#050505_100%)] overflow-hidden">
          <div className="absolute top-10 right-10 text-right z-20">
            <div className="text-[10px] uppercase text-[#888888] tracking-[3px] mb-1 font-mono">_CURRENT_YIELD</div>
            <div className="font-mono text-4xl text-[#39ff14] drop-shadow-[0_0_15px_#39ff14] mb-6 tracking-tighter">
              {score.toString().padStart(6, '0')}
            </div>
            <div className="text-[10px] uppercase text-[#888888] tracking-[3px] mb-1 font-mono">_MAX_CAPACITY</div>
            <div className="font-mono text-lg text-white/50 tracking-widest">
              {highScore.toString().padStart(6, '0')}
            </div>
          </div>
          
          <SnakeGame onScoreChange={handleScoreChange} />
        </section>
      </main>

      {/* Footer Player Bar */}
      <footer className="h-[100px] shrink-0 bg-[#0a0a0a] border-t border-[#222] relative z-10">
        <MusicPlayer />
      </footer>
    </div>
  );
}
