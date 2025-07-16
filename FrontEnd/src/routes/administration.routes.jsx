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
import { Validation } from './validation.jsx';
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
            <Validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <CreateVenue />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/crearEsp"
          element={
            <Validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <CreateSpecialty />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/crearOS"
          element={
            <Validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <CreateInsurance />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/combinacion"
          element={
            <Validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <CreateCombination />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/schedules"
          element={
            <Validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <CreateSchedules />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/crearDoc"
          element={
            <Validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <CreateDoctor />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/actualizarDoc/:doctorId"
          element={
            <Validation rol={rol} esperado={'Admin'}>
              <ProtectedRoute requiredRole="Admin">
                <UpdateDoctor />
              </ProtectedRoute>
            </Validation>
          }
        />
      </Routes>
    </AdministrationProvider>
  );
}
