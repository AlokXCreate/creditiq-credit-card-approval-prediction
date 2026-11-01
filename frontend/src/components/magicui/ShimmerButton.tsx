import React, { type ComponentPropsWithoutRef, type CSSProperties } from "react";
import { cn } from "../../lib/utils";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "#10B981",
      shimmerSize = "0.08em",
      shimmerDuration = "2.8s",
      borderRadius = "12px",
      background = "rgba(15, 23, 42, 0.95)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-emerald-500/20 px-6 py-3 whitespace-nowrap text-white [background:var(--bg)]",
          "transform-gpu transition-all duration-300 ease-in-out hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-emerald-500/20",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "@container absolute inset-0 overflow-visible"
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 aspect-square h-full rounded-none">
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]" />
          </div>
        </div>

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2 font-semibold">
          {children}
        </span>

        {/* Highlight inner reflection */}
        <div
          className={cn(
            "absolute inset-0 size-full pointer-events-none",
            "rounded-xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff10]",
            "transition-all duration-300 ease-in-out group-hover:shadow-[inset_0_-6px_10px_#10B98130]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute inset-(--cut) -z-20 [border-radius:var(--radius)] [background:var(--bg)]"
          )}
        />
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
