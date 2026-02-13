"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Heart positions - scattered around the page, some hidden in plain sight
const heartPositions = [
  { id: 1, top: "10%", left: "15%", size: 24, opacity: 0.3, hint: "💭" },
  { id: 2, top: "25%", right: "10%", size: 20, opacity: 0.25, hint: "✨" },
  { id: 3, bottom: "30%", left: "8%", size: 28, opacity: 0.2, hint: "🌸" },
  { id: 4, top: "50%", right: "20%", size: 22, opacity: 0.35, hint: "🦋" },
  { id: 5, bottom: "15%", right: "15%", size: 26, opacity: 0.28, hint: "⭐" },
  { id: 6, top: "70%", left: "25%", size: 18, opacity: 0.22, hint: "🌙" },
  { id: 7, bottom: "45%", left: "50%", size: 30, opacity: 0.15, hint: "💫" },
];

// Terminal messages for the loading sequence
const terminalMessages = [
  { text: "Initializing romance.exe...", delay: 0 },
  { text: "Loading romance module... ✅", delay: 800 },
  { text: "Scanning heart rate... 💓", delay: 1600 },
  { text: "Checking compatibility... ", delay: 2400, typing: true },
  { text: "100% ✅", delay: 3200, append: true },
  { text: "Loading memories... 📸", delay: 4000 },
  { text: "Compiling feelings... 💕", delay: 4800 },
  { text: "", delay: 5600 },
  { text: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━", delay: 5800 },
  { text: "FINAL PROMPT:", delay: 6400, highlight: true },
  { text: "", delay: 6600 },
  { text: "Will you be my Valentine? (Y/N)", delay: 7000, question: true },
];

// Placeholder photos - user will replace these
// Photo positions for messy collage - scattered overlapping layout
const photoConfigs = [
  { src: "/photos/1.jpg", top: "5%", left: "8%", rotate: -12, size: 140, zIndex: 1 },
  { src: "/photos/2.jpg", top: "3%", left: "35%", rotate: 8, size: 160, zIndex: 3 },
  { src: "/photos/3.jpg", top: "8%", right: "12%", rotate: -5, size: 150, zIndex: 2 },
  { src: "/photos/4.jpg", top: "20%", left: "15%", rotate: 15, size: 130, zIndex: 4 },
  { src: "/photos/5.jpg", top: "25%", left: "45%", rotate: -8, size: 170, zIndex: 5 },
  { src: "/photos/6.jpg", top: "18%", right: "8%", rotate: 10, size: 145, zIndex: 2 },
  { src: "/photos/7.jpg", top: "38%", left: "5%", rotate: -15, size: 155, zIndex: 6 },
  { src: "/photos/8.jpg", top: "42%", left: "30%", rotate: 6, size: 135, zIndex: 7 },
  { src: "/photos/9.jpg", top: "35%", right: "20%", rotate: -10, size: 165, zIndex: 4 },
  { src: "/photos/10.jpg", top: "55%", left: "12%", rotate: 12, size: 150, zIndex: 8 },
  { src: "/photos/11.jpg", top: "52%", left: "40%", rotate: -6, size: 140, zIndex: 9 },
  { src: "/photos/12.jpg", top: "50%", right: "10%", rotate: 8, size: 160, zIndex: 5 },
  { src: "/photos/13.jpg", top: "68%", left: "6%", rotate: -8, size: 145, zIndex: 10 },
  { src: "/photos/14.jpg", top: "70%", left: "32%", rotate: 14, size: 155, zIndex: 11 },
  { src: "/photos/15.jpg", top: "65%", right: "15%", rotate: -12, size: 135, zIndex: 6 },
  { src: "/photos/16.jpg", top: "82%", left: "18%", rotate: 5, size: 150, zIndex: 12 },
  { src: "/photos/17.jpg", top: "78%", left: "50%", rotate: -10, size: 165, zIndex: 13 },
  { src: "/photos/18.jpg", top: "80%", right: "8%", rotate: 7, size: 140, zIndex: 8 },
];

export default function Home() {
  const [step, setStep] = useState<"hearts" | "terminal" | "buttons" | "photos">("hearts");
  const [foundHearts, setFoundHearts] = useState<number[]>([]);
  const [terminalLines, setTerminalLines] = useState<typeof terminalMessages>([]);
  const [showButtons, setShowButtons] = useState(false);
  const [noButtonAttempts, setNoButtonAttempts] = useState(0);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [visiblePhotos, setVisiblePhotos] = useState<number[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Handle heart click
  const handleHeartClick = useCallback((id: number) => {
    if (!foundHearts.includes(id)) {
      const newFoundHearts = [...foundHearts, id];
      setFoundHearts(newFoundHearts);
      
      // All hearts found - move to terminal
      if (newFoundHearts.length === 7) {
        setTimeout(() => setStep("terminal"), 800);
      }
    }
  }, [foundHearts]);

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
      // Move button to random position
      setNoButtonPosition({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 150,
      });
    }
  };

  // Handle Yes click
  const handleYesClick = () => {
    setStep("photos");
    
    // Reveal photos one by one with slight randomness in timing
    photoConfigs.forEach((_, index) => {
      setTimeout(() => {
        setVisiblePhotos(prev => [...prev, index]);
        
        // Show final message after all photos
        if (index === photoConfigs.length - 1) {
          setTimeout(() => setShowFinalMessage(true), 800);
        }
      }, index * 200 + Math.random() * 100);
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-pink-100 via-rose-50 to-pink-200">
      {/* Floating background hearts */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-pink-200"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              y: -50,
              rotate: 0,
              opacity: 0.3 + Math.random() * 0.3
            }}
            animate={{ 
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 900,
              rotate: 360,
            }}
            transition={{ 
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{ fontSize: 12 + Math.random() * 20 }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      {/* Step 1: Find Hearts */}
      <AnimatePresence>
        {step === "hearts" && (
          <motion.div
            className="relative min-h-screen w-full"
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {/* Instructions */}
            <motion.div
              className="fixed top-8 left-1/2 z-10 -translate-x-1/2 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="rounded-2xl bg-white/80 px-6 py-4 shadow-lg backdrop-blur-sm">
                <p className="text-lg font-medium text-rose-600">
                  Find all the hidden hearts 💕
                </p>
                <p className="mt-1 text-sm text-rose-400">
                  {foundHearts.length} / 7 found
                </p>
                <div className="mt-2 flex justify-center gap-1">
                  {[...Array(7)].map((_, i) => (
                    <motion.span
                      key={i}
                      className={foundHearts.length > i ? "text-rose-500" : "text-rose-200"}
                      animate={foundHearts.length > i ? { scale: [1, 1.3, 1] } : {}}
                    >
                      ♥
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Hidden hearts */}
            {heartPositions.map((heart) => (
              <motion.button
                key={heart.id}
                className="absolute cursor-pointer select-none transition-all"
                style={{
                  top: heart.top,
                  left: heart.left,
                  right: heart.right,
                  bottom: heart.bottom,
                  fontSize: heart.size,
                  opacity: foundHearts.includes(heart.id) ? 0 : heart.opacity,
                }}
                onClick={() => handleHeartClick(heart.id)}
                whileHover={{ scale: 1.5, opacity: 1 }}
                whileTap={{ scale: 0.8 }}
                disabled={foundHearts.includes(heart.id)}
              >
                {foundHearts.includes(heart.id) ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 0] }}
                    transition={{ duration: 0.5 }}
                    className="text-rose-500"
                  >
                    ✓
                  </motion.span>
                ) : (
                  <span className="text-rose-400 hover:text-rose-500">♥</span>
                )}
              </motion.button>
            ))}

            {/* Hint text at bottom */}
            <motion.p
              className="fixed bottom-8 left-1/2 -translate-x-1/2 text-sm text-rose-300"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 3 }}
            >
              Hint: Hearts are hiding in plain sight... hover around ✨
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step 2 & 3: Terminal + Buttons */}
      <AnimatePresence>
        {(step === "terminal" || step === "buttons") && (
          <motion.div
            className="flex min-h-screen items-center justify-center p-4"
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
                          scale: noButtonAttempts >= 3 ? 0.5 : 1,
                          opacity: noButtonAttempts >= 3 ? 0.5 : 1,
                        }}
                        whileHover={noButtonAttempts < 3 ? { x: (Math.random() - 0.5) * 100 } : {}}
                        onClick={noButtonAttempts >= 3 ? handleYesClick : handleNoClick}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {noButtonAttempts >= 3 ? "Okay okay... Yes 😄" : "No"}
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
            className="fixed inset-0 overflow-hidden bg-gradient-to-br from-pink-200 via-rose-100 to-pink-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Scattered messy collage */}
            {photoConfigs.map((config, index) => (
              <AnimatePresence key={index}>
                {visiblePhotos.includes(index) && (
                  <motion.div
                    className="absolute overflow-hidden rounded-lg shadow-2xl border-4 border-white"
                    style={{
                      top: config.top,
                      left: config.left,
                      right: config.right,
                      width: config.size,
                      height: config.size,
                      zIndex: config.zIndex,
                    }}
                    initial={{ 
                      scale: 0, 
                      rotate: config.rotate - 30, 
                      opacity: 0,
                      y: -100
                    }}
                    animate={{ 
                      scale: 1, 
                      rotate: config.rotate, 
                      opacity: 1,
                      y: 0
                    }}
                    transition={{
                      type: "spring",
                      damping: 12,
                      stiffness: 100,
                    }}
                    whileHover={{ 
                      scale: 1.15, 
                      zIndex: 50,
                      rotate: 0,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                    }}
                  >
                    <Image
                      src={config.src}
                      alt={`Memory ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    {/* Heart pop effect on appear */}
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center bg-pink-500/30"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                    >
                      <span className="text-4xl">💕</span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            ))}

            {/* Final message */}
            <AnimatePresence>
              {showFinalMessage && (
                <motion.div
                  className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="mx-4 rounded-3xl bg-white/95 p-8 text-center shadow-2xl"
                    initial={{ scale: 0.5, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: "spring", damping: 12 }}
                  >
                    <motion.div
                      className="mb-4 text-6xl"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      💕
                    </motion.div>
                    <h1 className="mb-2 text-3xl font-bold text-rose-600">
                      Happy Valentine&apos;s Day!
                    </h1>
                    <p className="text-lg text-rose-500">
                      You mean the world to me 💝
                    </p>
                    <motion.div
                      className="mt-6 flex justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                    >
                      {["💕", "💖", "💗", "💓", "💝"].map((heart, i) => (
                        <motion.span
                          key={i}
                          className="text-2xl"
                          animate={{ y: [0, -10, 0] }}
                          transition={{
                            repeat: Infinity,
                            duration: 1,
                            delay: i * 0.1,
                          }}
                        >
                          {heart}
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
