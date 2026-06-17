import { Routes, Route } from 'react-router-dom';
import DoctorsProvider from '../context/doctors/DoctorsProvider.jsx';
import DoctorHome from '../pages/doctors/doctorHome.jsx';
import { AppointmentsByDate } from '../pages/doctors/appointmentsByDate.jsx';
import { TodayAppointments } from '../pages/doctors/todayAppointments.jsx';
import { HistoricalAppointments } from '../pages/doctors/historicalAppointments.jsx';
import UploadStudy from '../pages/doctors/uploadStudy.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { USER_TYPES } from '../constants/userTypes.js';

export function DoctorsRoutes() {
  return (
    <DoctorsProvider>
      <Routes>
        <Route path="/" element={<DoctorHome />} />
        <Route
          path="/appointmentHistory"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
              <HistoricalAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/todayAppointments"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
              <TodayAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointmentsByDate"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
              <AppointmentsByDate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploadStudy"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.DOCTOR}>
              <UploadStudy />
            </ProtectedRoute>
          }
        />
      </Routes>
    </DoctorsProvider>
  );
}
