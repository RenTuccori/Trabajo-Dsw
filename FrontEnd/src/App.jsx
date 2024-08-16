// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import HomeUsuario from './pages/homeUsuario';
import HomeDoctor from './pages/homeDoctor';
import { SacarTurno } from './pages/sacarturno';
import {DatosPersonales} from './pages/datospersonales';
import { VerTurnosDoctor } from './pages/turnosdoctor';
import Navbar from './componentes/navbar';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paciente" element={<HomeUsuario />} />
          <Route path="/doctor" element={<HomeDoctor />} />
          <Route path="/sacarturno" element={<SacarTurno />} />
          <Route path="/datospersonales" element={<DatosPersonales />} />
          <Route path="/turnosdoctor" element={<VerTurnosDoctor />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
