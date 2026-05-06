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
import { Validation } from './validation.jsx';
import { ProtectedRoute } from '../components/ProtectedRoute.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';
import { USER_TYPES } from '../constants/userTypes.js';

export function AdministrationRoutes() {
  const { rol } = useAuth();

  return (
    <AdministrationProvider>
      <Routes>
        <Route path="/" element={<AdministrationHome />} />
        <Route
          path="/createLocation"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateLocation />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createSpecialty"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateSpecialty />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createInsurance"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateInsurance />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createCombination"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateCombination />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createSchedules"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateSchedules />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createDoctor"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreateDoctor />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/updateDoctor/:doctorId"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <UpdateDoctor />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/updateDoctor"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <UpdateDoctor />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/createPatient"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <CreatePatient />
              </ProtectedRoute>
            </Validation>
          }
        />
        <Route
          path="/updatePatient/:id"
          element={
            <Validation rol={rol} expected={USER_TYPES.ADMIN}>
              <ProtectedRoute requiredRole={USER_TYPES.ADMIN}>
                <UpdatePatient />
              </ProtectedRoute>
            </Validation>
          }
        />
      </Routes>
    </AdministrationProvider>
  );
}
