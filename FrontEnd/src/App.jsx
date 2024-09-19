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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de Toastify

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
        <ToastContainer /> {/* Asegúrate de incluir ToastContainer */}
      </div>
    </Router>
  );
}

export default App;
