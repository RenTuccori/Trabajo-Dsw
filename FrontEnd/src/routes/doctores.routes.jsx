import { Routes, Route } from 'react-router-dom';
import DoctoresProvider from '../context/doctores/DoctoresProvider.jsx';
import HomeDoctor from '../pages/doctors/homeDoctor.jsx';
import { TurnosDoctorFecha } from '../pages/doctors/turnosDoctorFecha.jsx';
import { TurnosDoctorHoy } from '../pages/doctors/turnosDoctorHoy.jsx';
import { TurnosDoctorHistorico } from '../pages/doctors/turnosDoctorHistorico.jsx';
import SubirEstudio from '../pages/doctors/subirEstudio.jsx';
import { Validacion } from './validacion.jsx';
import { useAuth } from '../context/global/AuthProvider.jsx';

export function DoctoresRoutes() {
  const { rol } = useAuth();
  return (
    <DoctoresProvider>
      <Routes>
        <Route path="/" element={<HomeDoctor />} />
      </Routes>
      <Validacion rol={rol} esperado={'D'}>
        <Routes>
          <Route path="/turnoshist" element={<TurnosDoctorHistorico />} />
          <Route path="/turnoshoy" element={<TurnosDoctorHoy />} />
          <Route path="/turnosfecha" element={<TurnosDoctorFecha />} />
          <Route path="/estudios" element={<SubirEstudio />} />
        </Routes>
      </Validacion>
    </DoctoresProvider>
  );
}
