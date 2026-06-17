import { Routes, Route } from 'react-router-dom';
import AdministrationProvider from '../context/administration/AdministrationProvider.jsx';
import AdministrationHome from '../pages/administration/administrationHome.jsx';
import { CreateLocation } from '../pages/administration/createLocation.jsx';
import { CreateSpecialty } from '../pages/administration/createSpecialty.jsx';
import { CreateInsurance } from '../pages/administration/createInsurance.jsx';
import { CreateCombination } from '../pages/administration/createCombination.jsx';
import { CreateDoctor } from '../pages/administration/createDoctor.jsx';
import { UpdateDoctor } from '../pages/administration/updateDoctor.jsx';
import { CreateUser as CreatePatient } from '../pages/administration/createPatient.jsx';
import { UpdateUser as UpdatePatient } from '../pages/administration/updatePatient.jsx';
import { CreateSchedules } from '../pages/administration/createSchedules.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { USER_TYPES } from '../constants/userTypes.js';

export function AdministrationRoutes() {
  return (
    <AdministrationProvider>
      <Routes>
        <Route path="/" element={<AdministrationHome />} />
        <Route
          path="/createLocation"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <CreateLocation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createSpecialty"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <CreateSpecialty />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createInsurance"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <CreateInsurance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createCombination"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <CreateCombination />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createSchedules"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <CreateSchedules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createDoctor"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <CreateDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateDoctor/:doctorId"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <UpdateDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updateDoctor"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <UpdateDoctor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/createPatient"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <CreatePatient />
            </ProtectedRoute>
          }
        />
        <Route
          path="/updatePatient/:id"
          element={
            <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
              <UpdatePatient />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AdministrationProvider>
  );
}
