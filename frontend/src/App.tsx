import { useErrorBoundary } from 'use-error-boundary';
import './App.css';
import { Capa } from './components/Capa';
import { OrbitaCanvas } from './components/OrbitaCanvas';
import { SelectorEstrela } from './components/Seletor/SeletorEstrela';
import { SelectorPlaneta } from './components/Seletor/SeletorPlaneta';
import { OrbitaProvider } from './contexts/OrbitaContext';

function App() {
  const { ErrorBoundary, didCatch, error } = useErrorBoundary()

  return didCatch ? (
    <div>{error.message}</div>
  ) : (
    <>
      <ErrorBoundary>
        <OrbitaProvider>
          <Capa />
          <main className='main-wrapper'>
            <h1>Astro Orbit Simulator</h1>
            <div className="selector-container">
              <SelectorPlaneta />
              <SelectorEstrela />
            </div>
            <OrbitaCanvas />
          </main>
        </OrbitaProvider>
      </ErrorBoundary>
    </>
  );
}

export default App
