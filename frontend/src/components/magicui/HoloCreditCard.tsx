import { useState } from "react";
import { ShieldCheck, Wifi } from "lucide-react";

interface HoloCreditCardProps {
  applicantName?: string;
  creditScore?: number;
  tierName?: string;
  approved?: boolean | null;
  className?: string;
}

export function HoloCreditCard({
  applicantName = "ALEXANDER STERLING",
  creditScore = 780,
  tierName = "TIER 1 • PRIME ACCESS",
  approved = true,
  className = "",
}: HoloCreditCardProps) {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Subtle 3D tilt
    setRotate({ x: -(y / rect.height) * 16, y: (x / rect.width) * 16 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const isApproved = approved ?? true;

  return (
    <div
      style={{ perspective: "1000px" }}
      className={`relative inline-block w-full max-w-sm cursor-pointer select-none ${className}`}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: "transform 0.15s ease-out",
        }}
        className="relative w-full aspect-[1.586/1] rounded-2xl p-[1.5px] transition-shadow duration-300 shadow-2xl hover:shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-float"
      >
        {/* Iridescent Gradient Border Frame */}
        <div
          className={`size-full rounded-2xl p-[1.5px] ${
            isApproved
              ? "bg-gradient-to-tr from-emerald-500/80 via-white/20 to-indigo-500/80"
              : "bg-gradient-to-tr from-rose-500/80 via-white/20 to-amber-500/80"
          }`}
        >
          {/* Card Inner Body */}
          <div className="size-full rounded-2xl bg-gradient-to-br from-slate-900/95 via-[#0B1222]/95 to-slate-950/98 backdrop-blur-2xl p-6 flex flex-col justify-between text-white relative overflow-hidden">
            {/* Hologram Light Sheen */}
            <div className="absolute inset-0 animate-hologram pointer-events-none opacity-30" />

            {/* Ambient Corner Flare */}
            <div
              className={`absolute -top-12 -right-12 size-36 rounded-full blur-2xl pointer-events-none opacity-50 ${
                isApproved ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />

            {/* Header: Brand & Contactless */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-md">
                  <ShieldCheck className="size-4 text-white" />
                </div>
                <div>
                  <span className="font-extrabold text-xs tracking-[0.2em] text-white block">
                    CREDITIQ
                  </span>
                  <span className="text-[9px] font-semibold tracking-wider text-emerald-400 block uppercase">
                    {tierName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Wifi className="size-4 text-slate-400 rotate-90" />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 font-semibold text-emerald-400">
                  {creditScore ? `FICO ${creditScore}` : "UNRATED"}
                </span>
              </div>
            </div>

            {/* Chip & Antennas */}
            <div className="flex items-center gap-4 my-auto relative z-10">
              <div className="w-11 h-9 rounded-md bg-gradient-to-tr from-amber-300 via-amber-400 to-yellow-600 border border-amber-200/60 shadow-lg flex items-center justify-center relative overflow-hidden">
                {/* Microchip Contact Lines */}
                <div className="w-7 h-5 border border-amber-800/50 rounded-sm grid grid-cols-2">
                  <div className="border-r border-amber-800/50" />
                  <div />
                </div>
              </div>
              <span className="text-sm tracking-[0.3em] font-mono text-slate-400 font-bold">
                •••• 8892
              </span>
            </div>

            {/* Footer: Cardholder & Expiry */}
            <div className="flex items-end justify-between relative z-10 pt-2 border-t border-white/5">
              <div>
                <span className="text-[8px] tracking-[0.2em] uppercase font-mono text-slate-400 block">
                  AUTHORIZED CARDHOLDER
                </span>
                <span className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-100 uppercase truncate max-w-[190px] block font-mono">
                  {applicantName || "ANONYMOUS APPLICANT"}
                </span>
              </div>

              <div className="text-right">
                <span className="text-[8px] tracking-[0.2em] uppercase font-mono text-slate-400 block">
                  EXPIRES
                </span>
                <span className="text-xs font-mono font-bold text-slate-200">
                  10/31
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
