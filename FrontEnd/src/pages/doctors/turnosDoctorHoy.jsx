/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctores } from '../../context/doctores/DoctoresProvider.jsx';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';

export function VerTurnosDoctorHoy() {
  const {turnosHoy, TurnosHoy, comprobarToken} = useDoctores();
  const navigate = useNavigate();


  useEffect(() => {
    comprobarToken();
    TurnosHoy();

  }, []);

  const formatFechaHora = (fechaYHora) => {
        const opciones = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        return new Date(fechaYHora).toLocaleString('es-ES', opciones);
    };

    return (
        <div className="home-container">
            <div className= "home-container">
                <button className = "button" onClick={() => navigate('/doctor')}>Volver</button>
                <h1 className="text">Turnos de hoy</h1>
            </div>
            <div className="turnos-container">
                {turnosHoy.length > 0 ? (
                    turnosHoy.map((turno, index) => (
                        <div key={index} className="turno-card">
                            <p><strong>Sede:</strong> {turno.sede}</p>
                            <p><strong>Especialidad:</strong> {turno.especialidad}</p>
                            <p><strong>Fecha y Hora:</strong> {formatFechaHora(turno.fechaYHora)}</p>
                            <p><strong>Estado:</strong> {turno.estado}</p>
                            <p><strong>DNI Paciente:</strong> {turno.dni}</p>
                            <p><strong>Apellido y Nombre:</strong> {turno.nomyapel}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay turnos para mostrar</p>
                )}
            </div>
            </div>
    );
}

