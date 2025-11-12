import React, { useState, useEffect, useCallback, useRef } from 'react';
import { sofas, Sofa } from '../data/sofaData';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { Play, Pause, RotateCw } from 'lucide-react';

const SelectionPage: React.FC = () => {
  const [currentSofa, setCurrentSofa] = useState<Sofa>(sofas[0]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [fate, setFate] = useState<string | null>(null);
  const { isSpeaking, speak, cancel } = useTextToSpeech();
  const selectionInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    return () => {
      if (selectionInterval.current) {
        clearInterval(selectionInterval.current);
      }
      cancel(); // Stop any speech on component unmount
    };
  }, [cancel]);

  const selectSofa = useCallback((id: number) => {
    if (isSelecting) return;
    cancel();
    const newSofa = sofas.find(s => s.id === id) || sofas[0];
    setCurrentSofa(newSofa);
    setFate(null);
  }, [isSelecting, cancel]);

  const startRandomSelection = () => {
    if (isSelecting) return;
    cancel();
    setIsSelecting(true);
    setFate(null);

    selectionInterval.current = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * sofas.length);
      setCurrentSofa(sofas[randomIndex]);
    }, 100);

    setTimeout(() => {
      if (selectionInterval.current) {
        clearInterval(selectionInterval.current);
        selectionInterval.current = null;
      }
      const finalIndex = Math.floor(Math.random() * sofas.length);
      const destinedSofa = sofas[finalIndex];
      setCurrentSofa(destinedSofa);
      setIsSelecting(false);
      setFate(`Ваша судьба — ${destinedSofa.name}`);
    }, 3000);
  };
  
  const handleAudioToggle = () => {
    if (isSpeaking) {
      cancel();
    } else if (currentSofa.description) {
      speak(currentSofa.description);
    }
  };

  return (
    <div className={`container mx-auto p-4 md:p-8 min-h-screen flex flex-col transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <header className="text-center mb-4">
        <h1 className="font-magic text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 animate-text-glow">
          Sofa Tarot
        </h1>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Sofa Display */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
            <div className={`relative w-full aspect-video rounded-2xl shadow-2xl shadow-black/30 overflow-hidden transition-all duration-300 ${isSelecting ? 'blur-sm scale-95' : 'blur-0 scale-100'}`}>
                <img src={currentSofa.image} alt={currentSofa.name} className="w-full h-full object-cover" />
            </div>
             {fate && (
                <div className="mt-4 p-2 bg-black/30 rounded-lg">
                    <p className="font-magic text-2xl text-yellow-300 animate-pulse">{fate}</p>
                </div>
            )}
        </div>

        {/* Controls and Description */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-full max-w-md p-6 bg-slate-800/50 rounded-2xl backdrop-blur-sm border border-slate-600/50">
                <div className="flex items-center justify-between">
                  <h2 className="font-magic text-4xl text-slate-100">{currentSofa.name}</h2>
                  <button onClick={handleAudioToggle} disabled={isSelecting} className="p-2 rounded-full bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:bg-slate-500">
                    {isSpeaking ? <Pause size={24} /> : <Play size={24} />}
                  </button>
                </div>
                <div className="mt-4 text-slate-300 h-48 overflow-y-auto pr-2" style={{whiteSpace: 'pre-line'}}>
                    <p>{currentSofa.description}</p>
                </div>
            </div>

            <div className="mt-6">
                <button 
                  onClick={startRandomSelection} 
                  disabled={isSelecting}
                  className="font-magic text-3xl flex items-center gap-3 bg-gradient-to-br from-amber-400 to-yellow-600 text-white py-3 px-8 rounded-full shadow-lg shadow-yellow-500/20 hover:scale-105 transform transition-transform duration-300 disabled:bg-slate-500 disabled:shadow-none disabled:scale-100"
                >
                  <RotateCw className={`transition-transform duration-300 ${isSelecting ? 'animate-spin' : ''}`} size={28}/>
                  Диван выбирает тебя
                </button>
            </div>
        </div>
      </main>

      <footer className="w-full mt-8 flex flex-col items-center">
         <div className="flex flex-wrap justify-center gap-2 max-w-2xl mb-8">
            {sofas.map(sofa => (
                <button 
                    key={sofa.id}
                    onClick={() => selectSofa(sofa.id)}
                    disabled={isSelecting}
                    className={`w-10 h-10 rounded-full text-white transition-all duration-200 flex items-center justify-center font-bold
                      ${currentSofa.id === sofa.id && !isSelecting ? 'bg-amber-500 scale-110 shadow-md shadow-amber-500/50' : 'bg-slate-600 hover:bg-slate-500'}
                      disabled:bg-slate-700 disabled:text-slate-500`}
                >
                    {sofa.id}
                </button>
            ))}
        </div>
        <a href="https://t.me/shop_sofa_mag" target="_blank" rel="noopener noreferrer" className="font-magic text-2xl bg-sky-500 text-white py-2 px-6 rounded-full shadow-lg shadow-sky-500/30 hover:scale-105 transform transition-transform duration-300">
            Связаться с продавцом
        </a>
      </footer>
    </div>
  );
};

export default SelectionPage;