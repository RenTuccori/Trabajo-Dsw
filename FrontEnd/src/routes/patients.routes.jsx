import { Routes, Route } from 'react-router-dom';
import PatientsProvider from '../context/patients/PatientsProvider.jsx';
import UserHome from '../pages/users/userHome.jsx';
import { BookAppointment } from '../pages/users/bookAppointment.jsx';
import { PersonalData } from '../pages/users/personalData.jsx';
import { UserModification } from '../pages/users/userModification.jsx';
import { PatientAppointments } from '../pages/users/patientAppointments.jsx';
import { AppointmentConfirmation } from '../pages/users/appointmentConfirmation';
import ViewStudies from '../pages/users/viewStudies.jsx';
import { Validation } from './validation.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function PacientesRoutes() {
  const { rol } = useAuth();
  return (
    <PatientsProvider>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/personalData" element={<PersonalData />} />
        <Route
          path="/bookAppointment"
          element={
            <Validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <BookAppointment />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/editarpersonalData"
          element={
            <Validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <UserModification />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/appointmentConfirmation"
          element={
            <Validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <AppointmentConfirmation />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/verturnos"
          element={
            <Validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <PatientAppointments />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/estudios"
          element={
            <Validation rol={rol} esperado={'Patient'}>
              <ProtectedRoute requiredRole="Patient">
                <ViewStudies />
              </ProtectedRoute>
            </Validation>
          }
        />
      </Routes>
    </PatientsProvider>
  );
}
