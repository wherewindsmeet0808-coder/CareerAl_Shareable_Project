import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number; height?: string }> = ({
  count = 3,
  height = 'h-32'
}) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`w-full ${height} rounded-2xl bg-navy-900 border border-navy-800 animate-pulse relative overflow-hidden`}
        >
          <div className="p-6 space-y-3">
            <div className="h-4 bg-navy-800 rounded-md w-1/3"></div>
            <div className="h-3 bg-navy-800/60 rounded-md w-2/3"></div>
            <div className="h-3 bg-navy-800/40 rounded-md w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
