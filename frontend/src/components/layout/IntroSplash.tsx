import { useEffect, useState, useRef } from "react";
import { ShieldCheck, Cpu, ArrowRight } from "lucide-react";

interface IntroSplashProps {
  onComplete: () => void;
}

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING NEURAL RISK MATRIX & PREPROCESSOR...");
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background animated particle starfield
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }> = [];

    const colors = ["#10B981", "#6366F1", "#06B6D4", "#FFFFFF"];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const triggerExit = () => {
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 700); // 700ms smooth dissolve
  };

  // 5 Seconds Progress Timer
  useEffect(() => {
    const totalDuration = 5000; // 5000ms = 5 seconds
    const intervalTime = 40;
    const increment = 100 / (totalDuration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          triggerExit();
          return 100;
        }

        if (next < 25) {
          setStatusText("INITIALIZING NEURAL RISK MATRIX & DATA PREPROCESSOR...");
        } else if (next < 55) {
          setStatusText("LOADING SCIKIT-LEARN LOGISTIC REGRESSION ENGINE (ROC-AUC: 0.9636)...");
        } else if (next < 85) {
          setStatusText("SYNCHRONIZING 5-FOLD STRATIFIED GRIDSEARCHCV PARAMETERS...");
        } else {
          setStatusText("CALIBRATING RISK CLASSIFICATION BOUNDARIES... SYSTEM READY.");
        }

        return next;
      });
    }, intervalTime);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        clearInterval(timer);
        triggerExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#040711] overflow-hidden transition-all duration-700 ${
        fadeOut ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      {/* Background Starfield Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Radiant Floating Ambient Glows */}
      <div className="absolute -top-40 -left-40 size-[500px] rounded-full bg-emerald-500/15 blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-40 -right-40 size-[550px] rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl mx-auto space-y-8">
        {/* Floating Holographic Emblem */}
        <div className="relative animate-float">
          <div className="size-24 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-indigo-600 p-[2px] shadow-[0_0_50px_rgba(16,185,129,0.4)]">
            <div className="size-full rounded-3xl bg-[#070D1A]/90 backdrop-blur-xl flex items-center justify-center">
              <ShieldCheck className="size-12 text-emerald-400 animate-pulse" />
            </div>
          </div>
          {/* Subtle orbiting light ring */}
          <div className="absolute -inset-2 rounded-full border border-emerald-500/20 animate-spin-around opacity-60 pointer-events-none" />
        </div>

        {/* Dynamic Name Typography */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <Cpu className="size-3.5 text-emerald-400" />
            <span className="text-[11px] font-bold tracking-[0.25em] text-slate-300 uppercase">
              FinTech Machine Learning Suite
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              CREDIT
            </span>
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent glow-text-emerald">
              IQ
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 font-medium max-w-lg mx-auto tracking-wide">
            Automated Credit Risk Intelligence & Algorithmic Underwriting
          </p>
        </div>

        {/* 3D Holographic Card Mini-Preview */}
        <div className="w-72 sm:w-80 h-44 rounded-2xl p-[1.5px] bg-gradient-to-tr from-emerald-500/50 via-white/10 to-indigo-500/50 shadow-2xl animate-float-slow relative overflow-hidden">
          <div className="size-full rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0B1222]/90 to-slate-950/95 backdrop-blur-xl p-5 flex flex-col justify-between text-left relative overflow-hidden">
            {/* Hologram sheen */}
            <div className="absolute inset-0 animate-hologram pointer-events-none opacity-40" />

            <div className="flex justify-between items-start relative z-10">
              <span className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                CREDITIQ PRIME
              </span>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[9px] font-mono text-slate-400">86.2% ACC</span>
              </div>
            </div>

            {/* Chip */}
            <div className="w-9 h-7 rounded-md bg-gradient-to-tr from-amber-300 to-amber-500 border border-amber-200/50 flex items-center justify-center shadow-md relative z-10">
              <div className="w-5 h-4 border border-amber-700/40 rounded-sm" />
            </div>

            <div className="flex justify-between items-end relative z-10">
              <div>
                <span className="text-[9px] text-slate-400 block tracking-wider uppercase font-mono">
                  CARDHOLDER
                </span>
                <span className="text-xs font-bold text-white tracking-wide">
                  ENTERPRISE CLIENT
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-300">
                •••• 8892
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar & Status Feed */}
        <div className="w-full max-w-md space-y-3 pt-2">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-400 text-[11px] truncate max-w-[300px]">
              {statusText}
            </span>
            <span className="text-emerald-400 font-bold ml-2">
              {Math.min(100, Math.round(progress))}%
            </span>
          </div>

          <div className="h-1.5 w-full rounded-full bg-slate-900 border border-slate-800 overflow-hidden shadow-inner p-[1px]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500 shadow-[0_0_15px_#10B981] transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Skip Button */}
          <div className="pt-3">
            <button
              onClick={triggerExit}
              className="group inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-500/50 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-lg active:scale-95"
            >
              <span>Skip Intro to Dashboard</span>
              <ArrowRight className="size-3.5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
