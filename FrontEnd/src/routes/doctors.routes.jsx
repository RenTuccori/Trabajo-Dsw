import { Routes, Route } from 'react-router-dom';
import DoctorsProvider from '../context/doctors/DoctorsProvider.jsx';
import DoctorHome from '../pages/doctors/doctorHome.jsx';
import { AppointmentsByDate } from '../pages/doctors/appointmentsByDate.jsx';
import { TodayAppointments } from '../pages/doctors/todayAppointments.jsx';
import { HistoricalAppointments } from '../pages/doctors/historicalAppointments.jsx';
import UploadStudy from '../pages/doctors/uploadStudy.jsx';
import { Validation } from './validation.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';
import { USER_TYPES } from '../constants/userTypes.js';

export function DoctorsRoutes() {
  const { rol } = useAuth();
  return (
    <DoctorsProvider>
      <Routes>
        <Route path="/" element={<DoctorHome />} />
        <Route
          path="/appointmentHistory"
          element={
            <Validation rol={rol} expected={USER_TYPES.DOCTOR}>
              <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
                <HistoricalAppointments />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/todayAppointments"
          element={
            <Validation rol={rol} expected={USER_TYPES.DOCTOR}>
              <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
                <TodayAppointments />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/appointmentsByDate"
          element={
            <Validation rol={rol} expected={USER_TYPES.DOCTOR}>
              <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
                <AppointmentsByDate />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/uploadStudy"
          element={
            <Validation rol={rol} expected={USER_TYPES.DOCTOR}>
              <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
                <UploadStudy />
              </ProtectedRoute>
            </Validation>
          }
        />
      </Routes>
    </DoctorsProvider>
  );
}
