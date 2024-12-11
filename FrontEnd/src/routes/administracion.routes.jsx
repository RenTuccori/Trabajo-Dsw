import { Routes, Route } from 'react-router-dom';
import AdministracionProvider from '../context/administracion/AdministracionProvider.jsx';
import HomeAdmin from '../pages/administration/homeAdministracion.jsx';
import { CrearSede } from '../pages/administration/crearSede.jsx';
import { CrearEspecialidad } from '../pages/administration/crearEspecialidad.jsx';
import { CrearObraSocial } from '../pages/administration/crearObraSocial.jsx';
import { AsignarCombinacion } from '../pages/administration/crearCombinacion.jsx';
import { CrearDoctor } from '../pages/administration/crearDoctor.jsx';
import { ActualizarDoctor } from '../pages/administration/actualizarDoctor.jsx';
import { CrearHorarios } from '../pages/administration/crearHorarios.jsx';
import { Validacion } from './validacion.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function AdministracionRoutes() {
  const {rol} = useAuth();

  return (
    <AdministracionProvider>
      <Routes>
        <Route path="/" element={<HomeAdmin />} />
      </Routes>
      <Validacion rol={rol} esperado={'A'}>
        <Routes>
          <Route path="/crearSede" element={<CrearSede />} />
          <Route path="/crearEsp" element={<CrearEspecialidad />} />
          <Route path="/crearOS" element={<CrearObraSocial />} />
          <Route path="/combinacion" element={<AsignarCombinacion />} />
          <Route path="/horarios" element={<CrearHorarios />} />
          <Route path="/crearDoc" element={<CrearDoctor />} />
          <Route
            path="/actualizarDoc/:idDoctor"
            element={<ActualizarDoctor />}
          />
        </Routes>
      </Validacion>
    </AdministracionProvider>
  );
}
