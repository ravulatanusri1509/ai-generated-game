import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const nextDirectionRef = useRef<Point>(INITIAL_DIRECTION);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirectionRef.current = INITIAL_DIRECTION;
    setFood({ x: 5, y: 5 });
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setDirection(nextDirectionRef.current);
    const head = snake[0];
    const newHead = {
      x: (head.x + nextDirectionRef.current.x + GRID_SIZE) % GRID_SIZE,
      y: (head.y + nextDirectionRef.current.y + GRID_SIZE) % GRID_SIZE,
    };

    // Collision check
    if (snake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      setIsGameOver(true);
      return;
    }

    const newSnake = [newHead, ...snake];
    
    // Food check
    if (newHead.x === food.x && newHead.y === food.y) {
      const newScore = score + 10;
      setScore(newScore);
      onScoreChange(newScore);
      setFood(generateFood(newSnake));
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [snake, food, isPaused, isGameOver, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (direction.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (direction.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const gameLoop = (time: number) => {
    const speed = Math.max(50, 150 - score * 0.5);
    if (time - lastUpdateRef.current > speed) {
      moveSnake();
      lastUpdateRef.current = time;
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      <div 
        id="game-board"
        className="relative bg-[#050505] border-2 border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: '500px',
          height: '500px',
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
          backgroundSize: '25px 25px'
        }}
      >
        {/* Snake Head & Body */}
        {snake.map((seg, i) => (
          <motion.div
            key={`${i}-${seg.x}-${seg.y}`}
            initial={false}
            animate={{
              left: `${seg.x * 5}%`,
              top: `${seg.y * 5}%`,
            }}
            className={`absolute w-[5%] h-[5%] rounded-sm ${
              i === 0 ? 'bg-white shadow-[0_0_15px_#fff] z-10' : 'bg-[#ff00ff] shadow-[0_0_10px_#ff00ff]'
            }`}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="absolute w-[5%] h-[5%] bg-[#39ff14] rounded-full shadow-[0_0_15px_#39ff14] z-20"
          style={{
            left: `${food.x * 5}%`,
            top: `${food.y * 5}%`,
          }}
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-50 p-6 text-center"
            >
              <h2 className="text-4xl font-bold text-magenta-500 mb-2 tracking-tighter">GAME OVER</h2>
              <p className="text-cyan-400 font-mono mb-6">FINAL SCORE: {score}</p>
              <button
                onClick={resetGame}
                className="px-8 py-2 bg-cyan-500 text-black font-bold uppercase tracking-widest hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(6,182,212,0.5)]"
              >
                Reboot System
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-40"
            >
              <button
                onClick={() => setIsPaused(false)}
                className="group flex flex-col items-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full border-2 border-cyan-500 flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                  <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-cyan-400 border-b-[10px] border-b-transparent ml-1" />
                </div>
                <span className="text-cyan-400 font-mono tracking-widest uppercase text-sm">Initiate Protocol</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex space-x-8 text-xs font-mono text-cyan-500/70 uppercase">
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-cyan-300">ARROWS</kbd>
          <span>to navigate</span>
        </div>
        <div className="flex items-center space-x-2">
          <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-cyan-300">SPACE</kbd>
          <span>to pause</span>
        </div>
      </div>
    </div>
  );
}
