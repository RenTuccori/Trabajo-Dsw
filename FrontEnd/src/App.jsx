import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/navbar';
import { AdministrationRoutes } from './routes/administration.routes.jsx';
import { DoctorsRoutes } from './routes/doctors.routes.jsx';
import { PatientsRoutes } from './routes/patients.routes.jsx';
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
            {/* Redirige desde "/" a "/patient" */}
            <Route path="/" element={<Navigate to="/patient" />} />
            <Route path="/patient/*" element={<PatientsRoutes />} />
            <Route path="/doctor/*" element={<DoctorsRoutes />} />
            <Route path="/admin/*" element={<AdministrationRoutes />} />
          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{
              textAlign: 'center',
              fontFamily: 'Inter, Poppins, sans-serif',
            }}
            toastStyle={{
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
              padding: '12px 16px',
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;



