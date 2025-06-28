import { Routes, Route } from 'react-router-dom';
import AdministrationProvider from '../context/administration/AdministrationProvider.jsx';
import administrationHome from '../pages/administration/administrationHome.jsx';
import { createVenue } from '../pages/administration/createVenue.jsx';
import { createSpecialty } from '../pages/administration/createSpecialty.jsx';
import { createInsurance } from '../pages/administration/createInsurance.jsx';
import { createCombination } from '../pages/administration/createCombination.jsx';
import { createDoctor } from '../pages/administration/createDoctor.jsx';
import { updateDoctor } from '../pages/administration/updateDoctor.jsx';
import { createSchedules } from '../pages/administration/createSchedules.jsx';
import { validation } from './validation.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function AdministracionRoutes() {
  const { rol } = useAuth();

  return (
    <AdministrationProvider>
      <Routes>
        <Route path="/" element={<administrationHome />} />
        <Route
          path="/createVenue"
          element={
            <validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <createVenue />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/crearEsp"
          element={
            <validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <createSpecialty />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/crearOS"
          element={
            <validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <createInsurance />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/combinacion"
          element={
            <validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <createCombination />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/schedules"
          element={
            <validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <createSchedules />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/crearDoc"
          element={
            <validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <createDoctor />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/actualizarDoc/:doctorId"
          element={
            <validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <updateDoctor />
              </ProtectedRoute>
            </validation>
          }
        />
      </Routes>
    </AdministrationProvider>
  );
}



