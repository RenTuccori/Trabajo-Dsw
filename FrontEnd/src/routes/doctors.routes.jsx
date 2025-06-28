import { Routes, Route } from 'react-router-dom';
import DoctorsProvider from '../context/doctors/DoctorsProvider.jsx';
import doctorHome from '../pages/doctors/doctorHome.jsx';
import { appointmentsByDate } from '../pages/doctors/appointmentsByDate.jsx';
import { todayAppointments } from '../pages/doctors/todayAppointments.jsx';
import { historicalAppointments } from '../pages/doctors/historicalAppointments.jsx';
import uploadStudy from '../pages/doctors/uploadStudy.jsx';
import { validation } from './validation.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function DoctoresRoutes() {
  const { rol } = useAuth();
  return (
    <DoctorsProvider>
      <Routes>
        <Route path="/" element={<doctorHome />} />
        <Route
          path="/turnoshist"
          element={
            <validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <historicalAppointments />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/turnoshoy"
          element={
            <validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <todayAppointments />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/turnosfecha"
          element={
            <validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <appointmentsByDate />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/estudios"
          element={
            <validation rol={rol} esperado={'Doctor'}>
              <ProtectedRoute requiredRole="Doctor">
                <uploadStudy />
              </ProtectedRoute>
            </validation>
          }
        />
      </Routes>
    </DoctorsProvider>
  );
}



