import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/navbar';
import { AdministracionRoutes } from './routes/administracion.routes.jsx';
import { DoctoresRoutes } from './routes/doctores.routes.jsx';
import { PacientesRoutes } from './routes/pacientes.routes.jsx';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Redirige desde "/" a "/paciente" */}
          <Route path="/" element={<Navigate to="/paciente" />} />
          <Route path="/paciente/*" element={<PacientesRoutes />} />
          <Route path="/doctor/*" element={<DoctoresRoutes />} />
          <Route path="/admin/*" element={<AdministracionRoutes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
