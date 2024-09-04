// src/App.jsx
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import HomeUsuario from './pages/users/homeUsuario.jsx';
import {SacarTurno} from './pages/users/sacarturno.jsx';
import {DatosPersonales} from './pages/users/datospersonales.jsx';
import Navbar from './components/navbar';
import { EditarDatosPersonales } from './pages/users/modificacionUsuario.jsx';
import { TurnosPersonales } from './pages/users/verTurnosPaciente.jsx';
import { ConfirmacionTurno } from './pages/users/confirmacionTurno';
import { AdministracionRoutes } from './routes/administracion.routes.jsx';
import { DoctoresRoutes } from './routes/doctores.routes.jsx';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paciente" element={<HomeUsuario />} />
          <Route path="/doctor/*" element={<DoctoresRoutes />} />
          <Route path="/sacarturno" element={<SacarTurno />} />
          <Route path="/datospersonales" element={<DatosPersonales />} />
          <Route path="/editardatospersonales" element={<EditarDatosPersonales />} />
          <Route path="/confirmacionturno" element={<ConfirmacionTurno />} />
          <Route path="/verturnos" element={<TurnosPersonales />} />
          <Route path="/admin/*" element={<AdministracionRoutes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
