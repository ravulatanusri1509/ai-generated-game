import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music2, Volume2 } from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number; // in seconds
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  { id: 1, title: 'NEON VELOCITY', artist: 'CYBER_GEN_AI', duration: 184, color: '#22d3ee' },
  { id: 2, title: 'SYNTHETIC DREAMS', artist: 'NEURAL_LINK', duration: 215, color: '#d946ef' },
  { id: 3, title: 'PIXEL HEARTBEAT', artist: 'VOID_PROTOCOL', duration: 156, color: '#84cc16' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: number | null = null;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress(prev => (prev >= track.duration ? 0 : prev + 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, track.duration]);

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(prev => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-[280px_1fr_280px] h-full items-center px-8 border-t border-[#222]">
      {/* Now Playing */}
      <div className="flex items-center gap-4">
        <div className="w-[50px] h-[50px] shrink-0 rounded bg-gradient-to-br from-[#00f3ff] to-[#ff00ff]" />
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={track.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
            >
              <div className="text-sm font-semibold text-white truncate font-sans uppercase tracking-tight">{track.title}</div>
              <div className="text-xs text-[#888888] truncate font-mono uppercase tracking-widest">{track.artist}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-8">
          <button onClick={handlePrev} className="text-[#888888] hover:text-white transition-colors">
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black hover:scale-105 transition-transform active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </button>

          <button onClick={handleNext} className="text-[#888888] hover:text-white transition-colors">
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-[#888888] w-10 text-right">{formatTime(progress)}</span>
          <div className="w-[400px] h-1 bg-[#222] rounded-full relative overflow-hidden">
            <motion.div 
              className="absolute left-0 top-0 h-full bg-[#00f3ff] shadow-[0_0_8px_#00f3ff]"
              style={{ width: `${(progress / track.duration) * 100}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-[#888888] w-10">{formatTime(track.duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex justify-end items-center gap-3 text-[#888888]">
        <span className="text-[10px] tracking-widest font-bold font-mono">VOL</span>
        <div className="w-20 h-[3px] bg-[#333] relative rounded-full overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-4/5 bg-[#888]" />
        </div>
        <Volume2 className="w-4 h-4" />
      </div>
    </div>
  );
}
