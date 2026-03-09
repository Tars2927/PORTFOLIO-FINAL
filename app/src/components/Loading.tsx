import { useEffect, useState } from 'react';

interface LoadingProps {
  onComplete: () => void;
}

export default function Loading({ onComplete }: LoadingProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExiting(true);
            setTimeout(onComplete, 600);
          }, 300);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center transition-all duration-600 ${
        isExiting ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
      }`}
      style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
    >
      {/* Logo Animation */}
      <div className="relative mb-12">
        <div className="w-20 h-20 rounded-2xl bg-[var(--apple-blue)] flex items-center justify-center shadow-lg">
          <span className="text-3xl font-bold text-white">P</span>
        </div>
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-2xl bg-[var(--apple-blue)] animate-ping opacity-20" />
      </div>

      {/* Progress Bar */}
      <div className="w-48 h-1 bg-[var(--apple-gray)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--apple-blue)] rounded-full transition-all duration-150 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Loading Text */}
      <p className="mt-4 text-sm text-[var(--apple-text)] font-medium">
        Loading
        <span className="inline-block w-6 text-left">
          {progress < 30 && '...'}
          {progress >= 30 && progress < 60 && '..'}
          {progress >= 60 && progress < 90 && '.'}
          {progress >= 90 && ''}
        </span>
      </p>

      {/* Percentage */}
      <p className="mt-2 text-xs text-[var(--apple-text)]/60">
        {Math.min(Math.round(progress), 100)}%
      </p>
    </div>
  );
}
