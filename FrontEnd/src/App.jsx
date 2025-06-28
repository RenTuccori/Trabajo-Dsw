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
import AuthProvider from './context/global/AuthProvider.jsx';
import 'react-toastify/dist/ReactToastify.css';
// Configuración global de notificaciones
import './utils/notifications';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            {/* Redirige desde "/" a "/paciente" */}
            <Route path="/" element={<Navigate to="/paciente" />} />
            <Route path="/paciente/*" element={<PacientesRoutes />} />
            <Route path="/doctor/*" element={<DoctoresRoutes />} />
            <Route path="/admin/*" element={<AdministracionRoutes />} />
          </Routes>
          <ToastContainer
            position="top-center" // Centrar el toast en la parte superior
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            style={{
              textAlign: 'center', // Centrar el texto
              fontFamily: 'Poppins', // Usar la fuente Poppins
            }}
            bodyStyle={{
              backgroundColor: '#f0f4ff', // Cambiar color de fondo del toast
              color: '#2a2e45', // Cambiar color del texto
              borderRadius: '5px', // Bordes redondeados
            }}
            toastStyle={{
              backgroundColor: '#fff', // Fondo del toast
              border: '1px solid #5368e0', // Bordes personalizados
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
