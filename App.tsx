
import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import SelectionPage from './components/SelectionPage';

type Page = 'landing' | 'selection';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const goToSelection = useCallback(() => {
    setCurrentPage('selection');
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-slate-700 bg-[url('https://www.transparenttextures.com/patterns/stitched-wool.png')] overflow-hidden">
      {currentPage === 'landing' && <LandingPage onProceed={goToSelection} />}
      {currentPage === 'selection' && <SelectionPage />}
    </div>
  );
};

export default App;
