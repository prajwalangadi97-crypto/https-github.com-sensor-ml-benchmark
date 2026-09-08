import React, { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export const CountUp: React.FC<CountUpProps> = ({
  end,
  decimals = 0,
  duration = 1500,
  prefix = '',
  suffix = '',
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Cubic ease-out formula
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(easeOut * end);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

interface SpeedometerGaugeProps {
  value: number; // 0 to 100
  title: string;
  subtitle: string;
  target: string;
  color?: string;
}

export const SpeedometerGauge: React.FC<SpeedometerGaugeProps> = ({
  value,
  title,
  subtitle,
  target,
  color = '#06b6d4',
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value);
    }, 100);
    return () => clearTimeout(timer);
  }, [value]);

  const radius = 70;
  const circumference = Math.PI * radius; // Half circle gauge
  const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className="flex flex-col items-center p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
      <div className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
        {title}
      </div>

      <div className="relative w-48 h-28 flex justify-center items-end overflow-hidden">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 160 160">
          {/* Background Track Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
          />

          {/* Animated Value Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center Display Value */}
        <div className="absolute bottom-2 flex flex-col items-center">
          <div className="text-2xl font-bold font-mono text-white tracking-tight">
            <CountUp end={value} decimals={1} suffix="%" />
          </div>
          <span className="text-[10px] font-mono text-slate-400">Target: {target}</span>
        </div>
      </div>

      <div className="text-[11px] text-slate-400 font-mono mt-1 text-center">
        {subtitle}
      </div>
    </div>
  );
};
