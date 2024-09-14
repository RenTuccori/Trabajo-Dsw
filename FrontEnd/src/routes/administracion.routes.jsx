import { Routes, Route } from "react-router-dom";
import AdministracionProvider from "../context/administracion/AdministracionProvider.jsx";
import HomeAdmin from "../pages/administration/homeAdministracion.jsx";
import { CrearSede } from "../pages/administration/crearSede.jsx";
import { CrearEspecialidad } from "../pages/administration/crearEspecialidad.jsx";
import { CrearObraSocial } from "../pages/administration/crearObraSocial.jsx";



export function AdministracionRoutes() {
  return (
    <AdministracionProvider>
      <Routes>
        <Route path="/" element={<HomeAdmin />} />
        <Route path="/crearSede" element={<CrearSede />} />
        <Route path="/crearEsp" element={<CrearEspecialidad />} />
        <Route path="/crearOS" element={<CrearObraSocial />} />
      </Routes>
    </AdministracionProvider>
  );
}

