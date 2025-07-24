import { useState } from 'react';
import { Collapse } from 'react-collapse';
import { Toaster } from 'react-hot-toast';
import { useErrorBoundary } from 'use-error-boundary';
import './App.css';
import { Capa } from './components/Capa';
import { OrbitaCanvas } from './components/OrbitaCanvas';
import { SelectorEstrela } from './components/Seletor/SeletorEstrela';
import { SelectorFatorTemporal } from './components/Seletor/SeletorFatorTemporal';
import { SelectorPlaneta } from './components/Seletor/SeletorPlaneta';
import { OrbitaProvider } from './contexts/OrbitaContext';

function App() {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()
  const [isOpen, setIsOpen] = useState(true);

  const toggleCollapse = () => setIsOpen(prev => !prev);

  return didCatch ? (
    <div>{error.message}</div>
  ) : (
    <>
      <ErrorBoundary>
        <OrbitaProvider>
          <Capa />
          <main className='main-wrapper'>
            <Collapse initialStyle={{height: '0px', overflow: 'hidden'}} isOpened={isOpen}>
              <h1>Astro Orbit Simulator</h1>
              <div className="selector-container">
                <SelectorPlaneta />
                <SelectorEstrela />
                <SelectorFatorTemporal />
              </div>
            </Collapse>
            <button onClick={toggleCollapse} className="collapse-button">
              {isOpen ? 'Esconder controles ▲' : 'Mostrar controles ▼'}
            </button>
            <OrbitaCanvas />
            <Toaster />
          </main>
        </OrbitaProvider>
      </ErrorBoundary>
    </>
  );
}

export default App
