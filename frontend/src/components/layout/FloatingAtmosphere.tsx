import { useEffect, useState } from "react";

export function FloatingAtmosphere() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Dynamic Cursor Spotlight Follower */}
      <div
        className="absolute size-[600px] rounded-full blur-[140px] opacity-20 transition-transform duration-300 ease-out"
        style={{
          background: "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(99,102,241,0.15) 50%, transparent 70%)",
          transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        }}
      />

      {/* Primary Floating Neon Orb Top Left */}
      <div className="absolute -top-32 -left-32 size-[500px] rounded-full bg-emerald-500/10 blur-[130px] animate-float-slow" />

      {/* Secondary Floating Cosmic Orb Bottom Right */}
      <div className="absolute -bottom-40 -right-40 size-[600px] rounded-full bg-indigo-600/15 blur-[150px] animate-float-reverse" />

      {/* Tertiary Floating Cyan Accent Orb Top Right */}
      <div className="absolute top-1/4 right-10 size-[380px] rounded-full bg-teal-500/10 blur-[120px] animate-pulse-glow" />

      {/* Subtle Bottom Ambient Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#040711] to-transparent pointer-events-none" />
    </div>
  );
}
