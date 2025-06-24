import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Consultas from './pages/Consultas';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Loading from './pages/Loading';
import Resultados from './pages/Resultados';
import Confirmado from './pages/Confirmado';
import Alerta from './pages/Alerta';
import Login from './pages/Login';
import CavarMaisFundo from './pages/CavarMaisFundo';
import AcompanhamentoDetalhado from './pages/AcompanhamentoDetalhado';

function App() {
  return (
    <Router>
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
    </Router>
  );
}

export default App;