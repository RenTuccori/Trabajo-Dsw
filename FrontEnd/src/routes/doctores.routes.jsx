import { Routes, Route} from "react-router-dom";
import DoctoresProvider from "../context/doctores/DoctoresProvider.jsx";
import HomeDoctor from "../pages/doctors/homeDoctor.jsx";
import { VerTurnosDoctorFecha } from "../pages/doctors/turnosDoctorFecha.jsx";
import { VerTurnosDoctorHoy } from "../pages/doctors/turnosDoctorHoy.jsx";
import { VerTurnosDoctorHistorico } from "../pages/doctors/turnosDoctorHistorico.jsx";

export function DoctoresRoutes() {
  return (
    <DoctoresProvider>
      <Routes>
        <Route path="/" element={<HomeDoctor/>} />
        <Route path="../turnoshist" element={<VerTurnosDoctorHistorico />} />
        <Route path="../turnoshoy" element={<VerTurnosDoctorHoy />} />
        <Route path="../turnosfecha" element={<VerTurnosDoctorFecha />} />
      </Routes>
    </DoctoresProvider>
  );
}

