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
import { USER_TYPES } from '../constants/userTypes.js';

export function PatientsRoutes() {
  const { rol } = useAuth();
  return (
    <PatientsProvider>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/personalData" element={<PersonalData />} />
        <Route
          path="/bookAppointment"
          element={
            <Validation rol={rol} expected={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <BookAppointment />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/editPersonalData"
          element={
            <Validation rol={rol} expected={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <UserModification />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/appointmentConfirmation"
          element={
            <Validation rol={rol} expected={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <AppointmentConfirmation />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/myAppointments"
          element={
            <Validation rol={rol} expected={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <PatientAppointments />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/myStudies"
          element={
            <Validation rol={rol} expected={USER_TYPES.PATIENT}>
              <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
                <ViewStudies />
              </ProtectedRoute>
            </Validation>
          }
        />
      </Routes>
    </PatientsProvider>
  );
}
