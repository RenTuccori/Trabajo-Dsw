// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import HomeUsuario from './pages/homeUsuario';
import HomeDoctor from './pages/homeDoctor';
import { SacarTurno } from './pages/sacarturno';
import {DatosPersonales} from './pages/datospersonales';
import {VerTurnosDoctorHistorico } from './pages/turnosDoctorHistorico';
import Navbar from './componentes/navbar';
import { VerTurnosDoctorHoy } from './pages/turnosDoctorHoy';
import { VerTurnosDoctorFecha } from './pages/turnosDoctorFecha';

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
          <Route path="/turnoshist" element={<VerTurnosDoctorHistorico />} />
          <Route path="/turnoshoy" element={<VerTurnosDoctorHoy />} />
          <Route path="/turnosfecha" element={<VerTurnosDoctorFecha />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
