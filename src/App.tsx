import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'));
const Consultas = React.lazy(() => import('./pages/Consultas'));
const Terms = React.lazy(() => import('./pages/Terms'));
const Privacy = React.lazy(() => import('./pages/Privacy'));
const Loading = React.lazy(() => import('./pages/Loading'));
const Resultados = React.lazy(() => import('./pages/Resultados'));
const Confirmado = React.lazy(() => import('./pages/Confirmado'));
const Alerta = React.lazy(() => import('./pages/Alerta'));
const Login = React.lazy(() => import('./pages/Login'));
const CavarMaisFundo = React.lazy(() => import('./pages/CavarMaisFundo'));
const AcompanhamentoDetalhado = React.lazy(() => import('./pages/AcompanhamentoDetalhado'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/consultas" element={<Consultas />} />
            <Route path="/termos" element={<Terms />} />
            <Route path="/privacidade" element={<Privacy />} />
            <Route path="/loading" element={<Loading />} />
            <Route path="/resultados" element={<Resultados />} />
            <Route path="/confirmado" element={<Confirmado />} />
            <Route path="/alerta" element={<Alerta />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cavar_mais_fundo" element={<CavarMaisFundo />} />
            <Route path="/acompanhamento_detalhado" element={<AcompanhamentoDetalhado />} />
          </Routes>
        </Suspense>
      </Router>
    </ErrorBoundary>
  );
}

export default App;