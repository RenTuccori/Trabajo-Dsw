// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import HomeUsuario from './pages/users/homeUsuario.jsx';
import HomeDoctor from './pages/doctors/homeDoctor.jsx';
import {SacarTurno} from './pages/users/sacarturno.jsx';
import {DatosPersonales} from './pages/users/datospersonales.jsx';
import {VerTurnosDoctorHistorico } from './pages/doctors/turnosDoctorHistorico.jsx';
import Navbar from './components/navbar';
import { VerTurnosDoctorHoy } from './pages/doctors/turnosDoctorHoy.jsx';
import { VerTurnosDoctorFecha } from './pages/doctors/turnosDoctorFecha.jsx';
import { EditarDatosPersonales } from './pages/users/modificacionUsuario.jsx';
import { TurnosPersonales } from './pages/users/verTurnosPaciente.jsx';


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
          <Route path="/editardatospersonales" element={<EditarDatosPersonales />} />
          <Route path="/verturnos" element={<TurnosPersonales />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
