import { Routes, Route} from "react-router-dom";
import PacientesProvider from "../context/paciente/PacientesProvider.jsx";
import HomeUsuario from "../pages/users/homeUsuario.jsx";
import { SacarTurno } from "../pages/users/sacarturno.jsx";
import { DatosPersonales } from "../pages/users/datospersonales.jsx";
import { EditarDatosPersonales } from "../pages/users/modificacionUsuario.jsx";
import { TurnosPersonales } from "../pages/users/verTurnosPaciente.jsx";
import { ConfirmacionTurno } from "../pages/users/confirmacionTurno";

export function PacientesRoutes() {
  return (
    <PacientesProvider>
      <Routes>
        <Route path="/" element={<HomeUsuario/>} />
        <Route path="/sacarturno" element={<SacarTurno />} />
        <Route path="/datospersonales" element={<DatosPersonales />} />
        <Route path="/editardatospersonales" element={<EditarDatosPersonales />} />
        <Route path="/confirmacionturno" element={<ConfirmacionTurno />} />
        <Route path="/verturnos" element={<TurnosPersonales />} />
      </Routes>
    </PacientesProvider>
  );
}

