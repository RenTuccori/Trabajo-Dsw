/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctores } from '../../context/doctores/DoctoresProvider.jsx';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';

export function VerTurnosDoctorHistorico() {
  const {turnosHist , Historico, comprobarToken} = useDoctores();
  const navigate = useNavigate();


  useEffect(() => {
    comprobarToken();
    Historico();

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
                {turnosHist.length > 0 ? (
                    turnosHist.map((turnosHist, index) => (
                        <div key={index} className="turno-card">
                            <p><strong>Sede:</strong> {turnosHist.sede}</p>
                            <p><strong>Especialidad:</strong> {turnosHist.especialidad}</p>
                            <p><strong>Fecha y Hora:</strong> {formatFechaHora(turnosHist.fechaYHora)}</p>
                            <p><strong>Estado:</strong> {turnosHist.estado}</p>
                            <p><strong>DNI Paciente:</strong> {turnosHist.dni}</p>
                            <p><strong>Apellido y Nombre:</strong> {turnosHist.nomyapel}</p>
                        </div>
                    ))
                ) : (
                    <p>No hay turnos para mostrar</p>
                )}
            </div>
            </div>
    );
}
