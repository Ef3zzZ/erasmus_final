import React from 'react';

/** Çizilmiş AB işareti: mavi zemin üzerinde 12 yıldız halkası (emoji bayrak yerine). */
export const EuMark: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    return { x: 16 + Math.sin(a) * 8.2, y: 16 - Math.cos(a) * 8.2 };
  });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      role="img"
      aria-label="Avrupa Birliği"
    >
      <rect width="32" height="32" rx="6" fill="#2a4a9b" />
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1.35" fill="#f2c94c" />
      ))}
    </svg>
  );
};
