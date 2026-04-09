import { Routes, Route } from 'react-router-dom';
import AdministrationProvider from '../context/administration/AdministrationProvider.jsx';
import AdministrationHome from '../pages/administration/administrationHome.jsx';
import { CreateLocation } from '../pages/administration/createLocation.jsx';
import { CreateSpecialty } from '../pages/administration/createSpecialty.jsx';
import { CreateInsurance } from '../pages/administration/createInsurance.jsx';
import { CreateCombination } from '../pages/administration/createCombination.jsx';
import { CreateDoctor } from '../pages/administration/createDoctor.jsx';
import { UpdateDoctor } from '../pages/administration/updateDoctor.jsx';
import { CreateSchedules } from '../pages/administration/createSchedules.jsx';
import { Validation } from './validation.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';
import { USER_TYPES } from '../constants/userTypes.js';

export function AdministrationRoutes() {
  const { role } = useAuth();

  return (
    <AdministrationProvider>
      <Routes>
        <Route path="/" element={<AdministrationHome />} />
        <Route
          path="/createLocation"
          element={
            <Validation role={role} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateLocation />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createSpecialty"
          element={
            <Validation role={role} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateSpecialty />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createInsurance"
          element={
            <Validation role={role} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateInsurance />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createCombination"
          element={
            <Validation role={role} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateCombination />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createSchedules"
          element={
            <Validation role={role} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateSchedules />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createDoctor"
          element={
            <Validation role={role} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateDoctor />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/updateDoctor/:doctorId"
          element={
            <Validation role={role} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <UpdateDoctor />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/updateDoctor"
          element={
            <Validation role={role} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <UpdateDoctor />
              </ProtectedRoute>
            </Validation>
          }
        />
      </Routes>
    </AdministrationProvider>
  );
}
