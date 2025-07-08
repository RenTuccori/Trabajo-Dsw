import { Routes, Route } from 'react-router-dom';
import AdministrationProvider from '../context/administration/AdministrationProvider.jsx';
import AdministrationHome from '../pages/administration/administrationHome.jsx';
import { CreateVenue } from '../pages/administration/createVenue.jsx';
import { CreateSpecialty } from '../pages/administration/createSpecialty.jsx';
import { CreateInsurance } from '../pages/administration/createInsurance.jsx';
import { CreateCombination } from '../pages/administration/createCombination.jsx';
import { CreateDoctor } from '../pages/administration/createDoctor.jsx';
import { UpdateDoctor } from '../pages/administration/updateDoctor.jsx';
import { CreateSchedules } from '../pages/administration/createSchedules.jsx';
import { validation } from './validation.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function AdministracionRoutes() {
  const { rol } = useAuth();

  return (
    <AdministrationProvider>
      <Routes>
        <Route path="/" element={<AdministrationHome />} />
        <Route
          path="/createVenue"
          element={
            <validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <CreateVenue />
              </ProtectedRoute>
            </validation>
          }
        />
        <Route
          path="/crearEsp"
          element={
            <validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <CreateSpecialty />
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



