import React from "react";
import { cn } from "../../lib/utils";

interface BorderBeamProps {
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
  borderWidth?: number;
}

export function BorderBeam({
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = "#10B981",
  colorTo = "#6366F1",
  className,
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": `${size}px`,
          "--duration": duration,
          "--delay": `-${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--border-width": `${borderWidth}px`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        className
      )}
    >
      <div
        className={cn(
          "absolute aspect-square [animation:border-beam_calc(var(--duration)*1s)_infinite_linear]",
          "bg-gradient-to-r from-[var(--color-from)] via-[var(--color-to)] to-transparent"
        )}
        style={{
          width: "var(--size)",
          offsetPath: "rect(0 auto auto 0 round var(--size))",
        }}
      />
    </div>
  );
}
