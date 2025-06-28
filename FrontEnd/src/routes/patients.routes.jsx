import { Routes, Route } from 'react-router-dom';
import PatientsProvider from '../context/patients/PatientsProvider.jsx';
import userHome from '../pages/users/userHome.jsx';
import { bookAppointment } from '../pages/users/bookAppointment.jsx';
import { personalData } from '../pages/users/personalData.jsx';
import { userModification } from '../pages/users/userModification.jsx';
import { patientAppointments } from '../pages/users/patientAppointments.jsx';
import { appointmentConfirmation } from '../pages/users/appointmentConfirmation';
import viewStudies from '../pages/users/viewStudies.jsx';
import { validation } from './validation.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function PacientesRoutes() {
  const { rol } = useAuth();
  return (
    <PatientsProvider>
      <Routes>
        <Route path="/" element={<userHome />} />
        <Route path="/personalData" element={<personalData />} />
        <Route
          path="/bookAppointment"
          element={
            <validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <bookAppointment />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/editarpersonalData"
          element={
            <validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <userModification />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/appointmentConfirmation"
          element={
            <validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <appointmentConfirmation />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/verturnos"
          element={
            <validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <patientAppointments />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/estudios"
          element={
            <validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <viewStudies />
              </ProtectedRoute>
            </validation>
          }
        />
      </Routes>
    </PatientsProvider>
  );
}



