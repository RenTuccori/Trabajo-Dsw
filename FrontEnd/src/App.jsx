// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import { SacarTurno } from './pages/sacarturno';
import {DatosPersonales} from './pages/datospersonales';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sacarturno" element={<SacarTurno />} />
          <Route path="/datospersonales" element={<DatosPersonales />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
