import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import { AdministracionRoutes } from './routes/administracion.routes.jsx';
import { DoctoresRoutes } from './routes/doctores.routes.jsx';
import { PacientesRoutes } from './routes/pacientes.routes.jsx';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './context/global/AuthProvider.jsx';
import 'react-toastify/dist/ReactToastify.css';
// Global notifications configuration
import './utils/notifications';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            {/* Redirect from "/" to "/paciente" */}
            <Route path="/" element={<Navigate to="/paciente" />} />
            <Route path="/paciente/*" element={<PacientesRoutes />} />
            <Route path="/doctor/*" element={<DoctoresRoutes />} />
            <Route path="/admin/*" element={<AdministracionRoutes />} />
          </Routes>
          <ToastContainer
            position="top-center" // Center the toast at the top
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
              textAlign: 'center', // Center the text
              fontFamily: 'Poppins', // Use Poppins font
            }}
            bodyStyle={{
              backgroundColor: '#f0f4ff', // Change toast background color
              color: '#2a2e45', // Change text color
              borderRadius: '5px', // Rounded borders
            }}
            toastStyle={{
              backgroundColor: '#fff', // Toast background
              border: '1px solid #5368e0', // Custom borders
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
