import React, { useEffect, useState, useRef } from "react";
import { cn } from "../../lib/utils";

interface NumberTickerProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  startValue?: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function NumberTicker({
  value,
  startValue = 0,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  duration = 1500,
  className,
  ...props
}: NumberTickerProps) {
  const [displayValue, setDisplayValue] = useState(direction === "down" ? value : startValue);
  const startTimeRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = direction === "down" ? value : startValue;
      const target = direction === "down" ? startValue : value;

      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
        
        // Ease out expo
        const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = start + (target - start) * easeOut;
        
        setDisplayValue(current);

        if (progress < 1) {
          frameRef.current = requestAnimationFrame(animate);
        } else {
          setDisplayValue(target);
        }
      };

      frameRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      startTimeRef.current = null;
    };
  }, [value, startValue, direction, delay, duration]);

  const formatted = Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(Number(displayValue.toFixed(decimalPlaces)));

  return (
    <span
      className={cn("inline-block tabular-nums font-bold tracking-tight", className)}
      {...props}
    >
      {prefix}{formatted}{suffix}
    </span>
  );
}
