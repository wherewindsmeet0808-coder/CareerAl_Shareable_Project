import React from 'react';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  colorClass?: string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({
  score,
  size = 90,
  strokeWidth = 8,
  label = 'Score',
  colorClass
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;

  let strokeColor = '#3B82F6';
  if (colorClass) {
    strokeColor = colorClass;
  } else if (clamped >= 80) {
    strokeColor = '#10B981'; // Emerald
  } else if (clamped >= 60) {
    strokeColor = '#3B82F6'; // Brand Blue
  } else if (clamped >= 40) {
    strokeColor = '#F59E0B'; // Amber
  } else {
    strokeColor = '#EF4444'; // Rose
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-white">{clamped}%</span>
        </div>
      </div>
      {label && <span className="mt-1 text-xs font-medium text-slate-400">{label}</span>}
    </div>
  );
};
