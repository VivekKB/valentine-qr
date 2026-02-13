"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Base path for GitHub Pages deployment
const basePath = process.env.NODE_ENV === "production" ? "/valentine-qr" : "";

// Message fragments to collect
const messageFragments = [
  { id: 1, word: "Will" },
  { id: 2, word: "you" },
  { id: 3, word: "be" },
  { id: 4, word: "my" },
  { id: 5, word: "Valentine?" },
];

// Glitch characters for visual effect
const glitchChars = "!@#$%^&*()_+-=[]{}|;':\",./<>?`~█▓▒░";

// Terminal messages for the loading sequence
const terminalMessages = [
  { text: "Initializing romance.exe...", delay: 0 },
  { text: "Loading romance module... ✅", delay: 1200 },
  { text: "Scanning heart rate... 💓", delay: 2600 },
  { text: "Checking compatibility... ", delay: 4200, typing: true },
  { text: "100% ✅", delay: 5500, append: true },
  { text: "Loading memories... 📸", delay: 7000 },
  { text: "Compiling feelings... 💕", delay: 8500 },
  { text: "", delay: 10000 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 10300 },
  { text: "FINAL PROMPT:", delay: 11500, highlight: true },
  { text: "", delay: 12000 },
  { text: "Will you be my Valentine? (Y/N)", delay: 13000, question: true },
];

// Memory cards with photos and captions - update these with your memories!
const memoryCards = [
  { src: `${basePath}/photos/1.jpg`, caption: "First trip with the cuties 🐕" },
  { src: `${basePath}/photos/2.jpg`, caption: "First snow together ❄️" },
  { src: `${basePath}/photos/3.jpg`, caption: "The saree girl I fell for 😊" },
  { src: `${basePath}/photos/4.jpg`, caption: "First trek together 🥾" },
  { src: `${basePath}/photos/5.jpg`, caption: "Our first international trip ✈️" },
  { src: `${basePath}/photos/6.jpg`, caption: "My favorite photo of us 📸" },
  { src: `${basePath}/photos/7.jpg`, caption: "Our arcade madness 🕹️" },
  { src: `${basePath}/photos/8.jpg`, caption: "Late night talks 🌙" },
  { src: `${basePath}/photos/9.jpg`, caption: "Dancing through our bachelors 💃" },
  { src: `${basePath}/photos/10.jpg`, caption: "That bad trip turned into good photos 📷" },
  { src: `${basePath}/photos/11.jpg`, caption: "Your best hairstyle 💇‍♀️" },
  { src: `${basePath}/photos/12.jpg`, caption: "Getting lost together 🗺️" },
  { src: `${basePath}/photos/13.jpg`, caption: "Our first ocean adventure 🌊" },
];

// Glitch particle type
type GlitchParticle = {
  id: number;
  x: number;
  y: number;
  fragmentId: number;
  char: string;
  speed: number;
  direction: number;
};

export default function Home() {
  const [step, setStep] = useState<"glitch" | "terminal" | "buttons" | "photos">("glitch");
  const [collectedFragments, setCollectedFragments] = useState<number[]>([]);
  const [glitchParticles, setGlitchParticles] = useState<GlitchParticle[]>([]);
  const [glitchText, setGlitchText] = useState("Heart data corrupted");
  const [heartComplete, setHeartComplete] = useState(false);
  const [terminalLines, setTerminalLines] = useState<typeof terminalMessages>([]);
  const [showButtons, setShowButtons] = useState(false);
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [revealedMemories, setRevealedMemories] = useState<number[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [starPositions, setStarPositions] = useState<{left: number, top: number, duration: number, delay: number}[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate star positions on client only to avoid hydration mismatch
  useEffect(() => {
    const stars = [...Array(50)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2,
    }));
    setStarPositions(stars);
  }, []);

  // Initialize glitch particles
  useEffect(() => {
    if (step !== "glitch") return;
    
    const particles: GlitchParticle[] = [];
    messageFragments.forEach((fragment) => {
      // Create 3-4 particles per fragment
      const particleCount = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          id: fragment.id * 10 + i,
          x: Math.random() * 80 + 10, // 10-90% of screen
          y: Math.random() * 60 + 20, // 20-80% of screen
          fragmentId: fragment.id,
          char: glitchChars[Math.floor(Math.random() * glitchChars.length)],
          speed: 0.5 + Math.random() * 1.5,
          direction: Math.random() * Math.PI * 2,
        });
      }
    });
    setGlitchParticles(particles);
  }, [step]);

  // Animate glitch particles floating
  useEffect(() => {
    if (step !== "glitch" || glitchParticles.length === 0) return;

    const interval = setInterval(() => {
      setGlitchParticles(prev => prev.map(p => {
        let newX = p.x + Math.cos(p.direction) * p.speed * 0.3;
        let newY = p.y + Math.sin(p.direction) * p.speed * 0.3;
        let newDirection = p.direction;

        // Bounce off edges
        if (newX < 5 || newX > 95) {
          newDirection = Math.PI - newDirection;
          newX = Math.max(5, Math.min(95, newX));
        }
        if (newY < 15 || newY > 85) {
          newDirection = -newDirection;
          newY = Math.max(15, Math.min(85, newY));
        }

        // Add slight random drift
        newDirection += (Math.random() - 0.5) * 0.2;

        return {
          ...p,
          x: newX,
          y: newY,
          direction: newDirection,
          char: Math.random() > 0.9 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : p.char,
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, [step, glitchParticles.length]);

  // Glitch text effect
  useEffect(() => {
    if (step !== "glitch") return;

    const interval = setInterval(() => {
      const baseText = "Heart data corrupted";
      const glitched = baseText.split('').map(char => {
        if (char === ' ') return ' ';
        return Math.random() > 0.85 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char;
      }).join('');
      setGlitchText(glitched);
    }, 100);

    return () => clearInterval(interval);
  }, [step]);

  // Handle glitch particle tap
  const handleParticleTap = useCallback((fragmentId: number) => {
    if (!collectedFragments.includes(fragmentId)) {
      const newCollected = [...collectedFragments, fragmentId].sort((a, b) => a - b);
      setCollectedFragments(newCollected);
      
      // Remove particles for this fragment
      setGlitchParticles(prev => prev.filter(p => p.fragmentId !== fragmentId));
      
      // All fragments collected - show completion
      if (newCollected.length === messageFragments.length) {
        setTimeout(() => setHeartComplete(true), 500);
      }
    }
  }, [collectedFragments]);

  // Terminal typing effect
  useEffect(() => {
    if (step !== "terminal") return;

    terminalMessages.forEach((msg, index) => {
      setTimeout(() => {
        setTerminalLines(prev => [...prev, msg]);
        
        // Show buttons after terminal sequence
        if (index === terminalMessages.length - 1) {
          setTimeout(() => {
            setShowButtons(true);
            setStep("buttons");
          }, 1000);
        }
      }, msg.delay);
    });
  }, [step]);

  // Handle No button interaction
  const handleNoClick = () => {
    const attempts = noButtonAttempts + 1;
    setNoButtonAttempts(attempts);
    
    if (attempts < 3) {
      // Move button to random position - more movement, stay above terminal
      setNoButtonPosition({
        x: (Math.random() - 0.5) * 350,
        y: Math.random() * -120 - 20, // Only move up, never down
      });
    }
  };

  // Handle Yes click
  const handleYesClick = () => {
    setStep("photos");
  };

  // Handle memory card tap
  const handleMemoryReveal = (index: number) => {
    if (revealedMemories.includes(index)) return;
    setRevealedMemories(prev => {
      const newRevealed = [...prev, index];
      // Show final message when all memories are revealed
      if (newRevealed.length === memoryCards.length) {
        setTimeout(() => setShowFinalMessage(true), 600);
      }
      return newRevealed;
    });
  };

  return (
    <div ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-gray-950">
      {/* Scanline effect overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)',
        }}
      />

      {/* Step 1: Glitch Puzzle */}
      <AnimatePresence>
        {step === "glitch" && (
          <motion.div
            className="relative min-h-screen w-full"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Terminal-style header */}
            <motion.div
              className="fixed top-0 left-0 right-0 z-20 bg-gray-900/95 border-b border-red-500/50 px-4 py-4"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="max-w-2xl mx-auto">
                {/* Error header */}
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="h-3 w-3 rounded-full bg-red-500"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                  <span className="font-mono text-red-400 text-sm">SYSTEM ERROR</span>
                </div>
                
                {/* Glitchy error message */}
                <motion.h1
                  className="font-mono text-xl md:text-2xl text-red-500 font-bold tracking-wider"
                  animate={{ x: [0, -2, 2, 0] }}
                  transition={{ repeat: Infinity, duration: 0.1, repeatDelay: 2 }}
                >
                  ERROR: {glitchText}
                </motion.h1>
                
                {/* Instructions */}
                <motion.p
                  className="font-mono text-gray-400 text-sm mt-3"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  &gt; Tap the <span className="text-cyan-400">glowing symbols</span> floating below_
                </motion.p>
                <motion.p
                  className="font-mono text-gray-500 text-xs mt-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.7 }}
                  transition={{ delay: 2 }}
                >
                  (look for the flickering @#$% characters)
                </motion.p>
              </div>
            </motion.div>

            {/* Floating glitch particles */}
            {glitchParticles.map((particle) => (
              <motion.button
                key={particle.id}
                className="absolute cursor-pointer select-none font-mono font-bold z-10"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  fontSize: '24px',
                  textShadow: '0 0 10px currentColor, 0 0 20px currentColor',
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  scale: { repeat: Infinity, duration: 1 + Math.random() },
                  opacity: { repeat: Infinity, duration: 0.5 + Math.random() * 0.5 },
                }}
                whileHover={{ 
                  scale: 1.5, 
                  opacity: 1,
                  color: '#22c55e',
                }}
                whileTap={{ scale: 0.5 }}
                onClick={() => handleParticleTap(particle.fragmentId)}
              >
                <span className="text-cyan-400">{particle.char}</span>
              </motion.button>
            ))}

            {/* Random background glitch lines */}
            <div className="pointer-events-none fixed inset-0">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"
                  style={{
                    top: `${10 + i * 12}%`,
                    left: 0,
                    right: 0,
                  }}
                  animate={{
                    opacity: [0, 0.5, 0],
                    scaleX: [0, 1, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.3,
                    delay: i * 0.5 + Math.random() * 2,
                    repeatDelay: 3 + Math.random() * 5,
                  }}
                />
              ))}
            </div>

            {/* Assembling Heart Progress */}
            <motion.div
              className="fixed bottom-0 left-0 right-0 z-20 bg-gray-900/95 border-t border-pink-500/50 px-4 py-6"
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", damping: 20, delay: 0.3 }}
            >
              <div className="max-w-2xl mx-auto text-center">
                <p className="font-mono text-gray-500 text-xs mb-4">&gt; REASSEMBLING HEART DATA...</p>
                
                {/* Heart assembly visualization */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  {/* SVG Heart split into 5 pieces */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Piece 1 - Top left curve */}
                    <motion.path
                      d="M50 25 C50 25 35 10 20 10 C5 10 5 30 5 30 C5 45 20 55 35 65 L50 75"
                      fill="none"
                      stroke={collectedFragments.includes(1) ? "#ec4899" : "#374151"}
                      strokeWidth="3"
                      initial={{ pathLength: 0, opacity: 0.3 }}
                      animate={{ 
                        pathLength: collectedFragments.includes(1) ? 1 : 0,
                        opacity: collectedFragments.includes(1) ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.5, type: "spring" }}
                      style={{ filter: collectedFragments.includes(1) ? 'drop-shadow(0 0 8px #ec4899)' : 'none' }}
                    />
                    
                    {/* Piece 2 - Top right curve */}
                    <motion.path
                      d="M50 25 C50 25 65 10 80 10 C95 10 95 30 95 30 C95 45 80 55 65 65 L50 75"
                      fill="none"
                      stroke={collectedFragments.includes(2) ? "#ec4899" : "#374151"}
                      strokeWidth="3"
                      initial={{ pathLength: 0, opacity: 0.3 }}
                      animate={{ 
                        pathLength: collectedFragments.includes(2) ? 1 : 0,
                        opacity: collectedFragments.includes(2) ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.5, type: "spring" }}
                      style={{ filter: collectedFragments.includes(2) ? 'drop-shadow(0 0 8px #ec4899)' : 'none' }}
                    />
                    
                    {/* Piece 3 - Left side */}
                    <motion.path
                      d="M35 65 L50 75 L50 90"
                      fill="none"
                      stroke={collectedFragments.includes(3) ? "#ec4899" : "#374151"}
                      strokeWidth="3"
                      initial={{ pathLength: 0, opacity: 0.3 }}
                      animate={{ 
                        pathLength: collectedFragments.includes(3) ? 1 : 0,
                        opacity: collectedFragments.includes(3) ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.5, type: "spring" }}
                      style={{ filter: collectedFragments.includes(3) ? 'drop-shadow(0 0 8px #ec4899)' : 'none' }}
                    />
                    
                    {/* Piece 4 - Right side */}
                    <motion.path
                      d="M65 65 L50 75 L50 90"
                      fill="none"
                      stroke={collectedFragments.includes(4) ? "#ec4899" : "#374151"}
                      strokeWidth="3"
                      initial={{ pathLength: 0, opacity: 0.3 }}
                      animate={{ 
                        pathLength: collectedFragments.includes(4) ? 1 : 0,
                        opacity: collectedFragments.includes(4) ? 1 : 0.3,
                      }}
                      transition={{ duration: 0.5, type: "spring" }}
                      style={{ filter: collectedFragments.includes(4) ? 'drop-shadow(0 0 8px #ec4899)' : 'none' }}
                    />
                    
                    {/* Piece 5 - Center fill (appears when complete) */}
                    <motion.path
                      d="M50 25 C50 25 35 10 20 10 C5 10 5 30 5 30 C5 45 20 55 35 65 L50 90 L65 65 C80 55 95 45 95 30 C95 30 95 10 80 10 C65 10 50 25 50 25"
                      fill={collectedFragments.includes(5) ? "#ec4899" : "transparent"}
                      stroke="none"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: collectedFragments.includes(5) ? 1 : 0,
                        scale: collectedFragments.includes(5) ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.5, type: "spring" }}
                      style={{ filter: collectedFragments.includes(5) ? 'drop-shadow(0 0 15px #ec4899)' : 'none' }}
                    />
                  </svg>
                  
                  {/* Glowing effect when complete */}
                  <AnimatePresence>
                    {collectedFragments.length === messageFragments.length && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl"
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Progress text */}
                <p className="font-mono text-pink-400 text-sm">
                  {collectedFragments.length}/{messageFragments.length} fragments collected
                </p>
                
                {/* Completion message */}
                <AnimatePresence>
                  {heartComplete && (
                    <motion.div
                      className="absolute inset-0 bg-gray-900/98 flex flex-col items-center justify-center rounded-xl"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Celebration emoji */}
                      <motion.div
                        className="text-6xl mb-4"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, -10, 10, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        💖
                      </motion.div>
                      
                      <motion.h2
                        className="font-mono text-2xl text-pink-400 font-bold mb-2"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        You did it!
                      </motion.h2>
                      
                      <motion.p
                        className="font-mono text-green-400 text-sm mb-1"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                      >
                        ✓ Heart successfully restored
                      </motion.p>
                      
                      <motion.p
                        className="font-mono text-gray-400 text-xs mb-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        But wait... there&apos;s a message waiting for you
                      </motion.p>
                      
                      <motion.button
                        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg font-mono text-white font-bold shadow-lg shadow-pink-500/30"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(236, 72, 153, 0.5)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStep("terminal")}
                      >
                        💌 Open Message
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2 & 3: Terminal + Buttons */}
      <AnimatePresence>
        {(step === "terminal" || step === "buttons") && (
          <motion.div
            className="flex min-h-screen items-center justify-center p-4 bg-gray-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl overflow-hidden rounded-xl bg-gray-900 shadow-2xl"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              {/* Terminal header */}
              <div className="flex items-center gap-2 bg-gray-800 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-gray-400">love-terminal ~ 💕</span>
              </div>

              {/* Terminal content */}
              <div className="min-h-[300px] p-6 font-mono text-sm">
                {terminalLines.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`mb-1 ${
                      line.highlight
                        ? "text-xl font-bold text-pink-400"
                        : line.question
                        ? "text-lg text-rose-300"
                        : line.append
                        ? "inline text-green-400"
                        : "text-green-400"
                    }`}
                  >
                    {!line.append && <span className="text-pink-400">❯ </span>}
                    {line.text}
                    {line.typing && (
                      <motion.span
                        animate={{ opacity: [1, 0] }}
                        transition={{ duration: 0.5, repeat: 3 }}
                      >
                        ▋
                      </motion.span>
                    )}
                  </motion.div>
                ))}

                {/* Yes/No Buttons */}
                <AnimatePresence>
                  {showButtons && (
                    <motion.div
                      className="mt-8 flex justify-center gap-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <motion.button
                        className="rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 px-8 py-3 text-lg font-bold text-white shadow-lg transition-all hover:shadow-pink-500/50"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleYesClick}
                      >
                        Yes! 💕
                      </motion.button>

                      <motion.button
                        className="rounded-lg bg-gray-600 px-8 py-3 text-lg font-bold text-white shadow-lg"
                        animate={{
                          x: noButtonPosition.x,
                          y: noButtonPosition.y,
                        }}
                        whileHover={{ scale: noButtonAttempts < 3 ? 1.05 : 1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={noButtonAttempts >= 3 ? handleYesClick : handleNoClick}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        {noButtonAttempts >= 3 ? "Okay okay... how about Yes? 😄" : "No"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 4: Messy Photo Collage */}
      <AnimatePresence>
        {step === "photos" && (
          <motion.div
            className="fixed inset-0 overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-purple-950"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Twinkling stars background */}
            {starPositions.map((star, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white"
                style={{
                  left: `${star.left}%`,
                  top: `${star.top}%`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: star.duration,
                  repeat: Infinity,
                  delay: star.delay,
                }}
              />
            ))}

            {/* Intro message */}
            {revealedMemories.length === 0 && (
              <motion.div
                className="absolute left-0 right-0 top-6 z-20 px-4 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-lg font-medium text-purple-200">
                  Our memories are written in the stars... ✨
                </p>
                <p className="mt-1 text-sm text-purple-300/80">
                  Tap each star to reveal them 💫
                </p>
              </motion.div>
            )}

            {/* Progress indicator */}
            {revealedMemories.length > 0 && revealedMemories.length < memoryCards.length && (
              <motion.div
                className="absolute left-0 right-0 top-4 z-20 px-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="text-sm text-purple-300">
                  {revealedMemories.length} / {memoryCards.length} memories discovered 🌟
                </p>
              </motion.div>
            )}

            {/* Floating constellation photos */}
            <div className="absolute inset-0">
              {memoryCards.map((card, index) => {
                const isRevealed = revealedMemories.includes(index);
                // Scatter positions for constellation effect
                const positions = [
                  { top: "8%", left: "5%", size: "100px" },
                  { top: "15%", left: "65%", size: "90px" },
                  { top: "25%", left: "35%", size: "110px" },
                  { top: "12%", right: "8%", size: "85px" },
                  { top: "40%", left: "8%", size: "95px" },
                  { top: "38%", right: "12%", size: "105px" },
                  { top: "55%", left: "25%", size: "88px" },
                  { top: "52%", right: "5%", size: "92px" },
                  { top: "68%", left: "5%", size: "98px" },
                  { top: "65%", left: "55%", size: "90px" },
                  { top: "80%", left: "30%", size: "85px" },
                  { top: "78%", right: "15%", size: "95px" },
                  { top: "48%", left: "45%", size: "100px" },
                ];
                const pos = positions[index] || positions[0];
                
                return (
                  <motion.div
                    key={index}
                    className="absolute cursor-pointer"
                    style={{
                      top: pos.top,
                      left: pos.left,
                      right: pos.right,
                      width: pos.size,
                      height: pos.size,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      y: [0, -5, 0],
                    }}
                    transition={{
                      opacity: { delay: index * 0.1, duration: 0.5 },
                      scale: { delay: index * 0.1, duration: 0.5, type: "spring" },
                      y: { repeat: Infinity, duration: 3 + index * 0.2, ease: "easeInOut" },
                    }}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMemoryReveal(index)}
                  >
                    {/* Glow effect */}
                    <motion.div
                      className={`absolute -inset-2 rounded-full ${
                        isRevealed
                          ? "bg-purple-400/40 blur-xl"
                          : "bg-indigo-400/30 blur-lg"
                      }`}
                      animate={!isRevealed ? {
                        opacity: [0.3, 0.6, 0.3],
                        scale: [1, 1.1, 1],
                      } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    />
                    
                    {/* Photo container */}
                    <div className={`relative h-full w-full overflow-hidden rounded-full border-2 ${
                      isRevealed 
                        ? "border-purple-300/60" 
                        : "border-indigo-400/40"
                    }`}>
                      <Image
                        src={card.src}
                        alt={`Memory ${index + 1}`}
                        fill
                        className={`object-cover transition-all duration-700 ${
                          isRevealed ? "blur-0 brightness-100" : "blur-md brightness-50"
                        }`}
                        sizes="(max-width: 768px) 150px, 200px"
                        quality={90}
                      />
                      
                      {/* Star overlay when not revealed */}
                      <AnimatePresence>
                        {!isRevealed && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-indigo-900/40"
                            exit={{ opacity: 0, scale: 1.5 }}
                            transition={{ duration: 0.4 }}
                          >
                            <motion.span 
                              className="text-2xl"
                              animate={{ rotate: [0, 180, 360] }}
                              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                            >
                              ⭐
                            </motion.span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Caption on reveal */}
                    <AnimatePresence>
                      {isRevealed && (
                        <motion.div
                          className="absolute -bottom-8 left-1/2 w-32 -translate-x-1/2 text-center"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <p className="text-xs font-medium text-purple-200 drop-shadow-lg">
                            {card.caption}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {/* Final message */}
            <AnimatePresence>
              {showFinalMessage && (
                <motion.div
                  className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="mx-4 rounded-3xl border border-purple-400/30 bg-gradient-to-b from-indigo-950/95 to-purple-950/95 p-8 text-center shadow-2xl"
                    initial={{ scale: 0.5, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    <motion.div
                      className="mb-4 text-6xl"
                      animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      🌟
                    </motion.div>
                    <h1 className="mb-2 text-3xl font-bold text-purple-200">
                      Happy Valentine&apos;s Day!
                    </h1>
                    <p className="text-lg text-purple-300">
                      You are my brightest star 💫
                    </p>
                    <motion.div
                      className="mt-6 flex justify-center gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {["⭐", "✨", "🌟", "💫", "✨"].map((star, i) => (
                        <motion.span
                          key={i}
                          className="text-2xl"
                          animate={{ 
                            y: [0, -8, 0],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            delay: i * 0.15,
                          }}
                        >
                          {star}
                        </motion.span>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
