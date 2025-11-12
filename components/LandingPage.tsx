
import React, { useState, useEffect } from 'react';

interface LandingPageProps {
  onProceed: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onProceed }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleProceed = () => {
    setVisible(false);
    setTimeout(onProceed, 600); // Wait for fade-out animation
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 text-center transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative transform transition-all duration-700 ease-out ${visible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}">
        <h1 className="font-magic text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 animate-text-glow">
          Диван выбирает тебя
        </h1>
      </div>
      
      <div className={`mt-6 max-w-lg transform transition-all duration-700 ease-out delay-200 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <p className="font-magic text-2xl md:text-3xl text-slate-300">
          Магазин мягкой мебели в Минске приглашает создать атмосферу уюта — ваш диван ждет своего хозяина. Выбирайте лучшее вместе с нами!
        </p>
      </div>

      <div className={`mt-12 transform transition-all duration-700 ease-out delay-300 ${visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <button
          onClick={handleProceed}
          className="particle-button font-magic text-4xl bg-gradient-to-br from-amber-400 to-yellow-600 text-white py-4 px-12 rounded-full shadow-lg shadow-yellow-500/20 hover:scale-105 transform transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
        >
          Далее
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
