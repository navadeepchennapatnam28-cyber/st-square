import React, { useMemo } from 'react';

interface BubbleConfig {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
  opacity: number;
  swayAmount: number;
}

export const WaterBubblesBackground: React.FC = () => {
  // Ultra-smooth, lightweight 60FPS water bubbles configuration
  const bubbles: BubbleConfig[] = useMemo(() => {
    return [
      { id: 1, size: 28, left: 6, duration: 22, delay: 0, opacity: 0.65, swayAmount: 22 },
      { id: 2, size: 54, left: 14, duration: 28, delay: 6, opacity: 0.50, swayAmount: -28 },
      { id: 3, size: 18, left: 24, duration: 18, delay: 12, opacity: 0.70, swayAmount: 18 },
      { id: 4, size: 42, left: 33, duration: 24, delay: 3, opacity: 0.55, swayAmount: -24 },
      { id: 5, size: 72, left: 45, duration: 32, delay: 9, opacity: 0.45, swayAmount: 32 },
      { id: 6, size: 22, left: 54, duration: 20, delay: 15, opacity: 0.75, swayAmount: -20 },
      { id: 7, size: 36, left: 63, duration: 23, delay: 1, opacity: 0.60, swayAmount: 25 },
      { id: 8, size: 64, left: 74, duration: 30, delay: 8, opacity: 0.48, swayAmount: -30 },
      { id: 9, size: 16, left: 83, duration: 17, delay: 14, opacity: 0.80, swayAmount: 16 },
      { id: 10, size: 48, left: 91, duration: 26, delay: 4, opacity: 0.52, swayAmount: -26 },
      { id: 11, size: 32, left: 20, duration: 21, delay: 18, opacity: 0.62, swayAmount: 20 },
      { id: 12, size: 58, left: 68, duration: 29, delay: 21, opacity: 0.48, swayAmount: -28 },
    ];
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-[1] select-none"
    >
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="water-bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            opacity: b.opacity,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            ['--sway' as string]: `${b.swayAmount}px`,
          }}
        />
      ))}
    </div>
  );
};
