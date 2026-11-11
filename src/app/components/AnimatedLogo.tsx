import { useEffect, useState } from 'react';
import logoImg from '../../imports/estoque.jpg';

interface AnimatedLogoProps {
  size?: 'small' | 'large';
  showText?: boolean;
}

export function AnimatedLogo({ size = 'large', showText = true }: AnimatedLogoProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const imgHeight = size === 'large' ? 'h-12' : 'h-9';
  const textSize = size === 'large' ? 'text-2xl' : 'text-xl';

  return (
    <div
      className={`flex items-center gap-2 group cursor-pointer transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
    >
      <img
        src={logoImg}
        alt="Estoque Fácil"
        className={`${imgHeight} w-auto object-contain transition-transform duration-500 group-hover:scale-110`}
      />
      {showText && (
        <span
          className={`${textSize} font-extrabold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent transition-all duration-300 group-hover:scale-105`}
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          Estoque Fácil
        </span>
      )}
    </div>
  );
}
