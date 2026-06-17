import { Routes, Route } from 'react-router-dom';
import PatientsProvider from '../context/patients/PatientsProvider.jsx';
import UserHome from '../pages/users/userHome.jsx';
import { BookAppointment } from '../pages/users/bookAppointment.jsx';
import { PersonalData } from '../pages/users/personalData.jsx';
import { UserModification } from '../pages/users/userModification.jsx';
import { PatientAppointments } from '../pages/users/patientAppointments.jsx';
import { AppointmentConfirmation } from '../pages/users/appointmentConfirmation';
import ViewStudies from '../pages/users/viewStudies.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { USER_TYPES } from '../constants/userTypes.js';

export function PatientsRoutes() {
  return (
    <PatientsProvider>
      <Routes>
        <Route path="/" element={<UserHome />} />
        <Route path="/personalData" element={<PersonalData />} />
        <Route
          path="/bookAppointment"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/editPersonalData"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
              <UserModification />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointmentConfirmation"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
              <AppointmentConfirmation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myAppointments"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
              <PatientAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myStudies"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.PATIENT}>
              <ViewStudies />
            </ProtectedRoute>
          }
        />
      </Routes>
    </PatientsProvider>
  );
}
