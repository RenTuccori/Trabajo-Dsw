import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import Navbar from './components/navbar';
import { AdministracionRoutes } from './routes/administracion.routes.jsx';
import { DoctoresRoutes } from './routes/doctores.routes.jsx';
import { PacientesRoutes } from './routes/pacientes.routes.jsx';
import { ToastContainer } from 'react-toastify';
import AuthProvider from './context/global/AuthProvider.jsx';
import { useAuth } from './context/global/AuthProvider.jsx';
import 'react-toastify/dist/ReactToastify.css';

// Component to handle dynamic home redirect
const HomeRedirect = () => {
  const { userType } = useAuth();
  
  // If user is authenticated, redirect to their appropriate home
  if (userType) {
    switch(userType) {
      case 'D': return <Navigate to="/doctor" replace />;
      case 'A': return <Navigate to="/admin" replace />;
      case 'P': return <Navigate to="/paciente" replace />;
      default: return <Navigate to="/paciente" replace />;
    }
  }
  
  // If no user type, show patient login as default
  return <Navigate to="/paciente" replace />;
};

// Component to protect routes based on user role
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { userType } = useAuth();
  
  // If no userType (not authenticated), allow access to show login forms
  if (!userType) {
    return children;
  }
  
  if (!allowedRoles.includes(userType)) {
    // Redirect to their correct home if they try to access wrong route
    switch(userType) {
      case 'D': return <Navigate to="/doctor" replace />;
      case 'A': return <Navigate to="/admin" replace />;
      case 'P': return <Navigate to="/paciente" replace />;
      default: return <Navigate to="/paciente" replace />;
    }
  }
  
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div>
          <Navbar />
          <Routes>
            {/* Dynamic redirect based on user type */}
            <Route path="/" element={<HomeRedirect />} />
            <Route 
              path="/paciente/*" 
              element={
                <ProtectedRoute allowedRoles={['P']}>
                  <PacientesRoutes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/doctor/*" 
              element={
                <ProtectedRoute allowedRoles={['D']}>
                  <DoctoresRoutes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <ProtectedRoute allowedRoles={['A']}>
                  <AdministracionRoutes />
                </ProtectedRoute>
              } 
            />
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
