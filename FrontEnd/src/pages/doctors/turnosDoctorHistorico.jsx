/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctores } from '../../context/doctores/DoctoresProvider.jsx';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';

export function VerTurnosDoctorHistorico() {
    const { turnosHist, Historico, comprobarToken } = useDoctores();
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
        <div className="lista-wrapper">
            <h1 className="text-turno">Historial Turnos</h1>
            <div className="turnos-lista">
                {turnosHist.length > 0 ? (
                    turnosHist.map((turno, index) => (
                        <ul key={index} className="turno-item">
                            <p><strong>Sede:</strong> {turno.sede}</p>
                            <p><strong>Especialidad:</strong> {turno.especialidad}</p>
                            <p><strong>Fecha y Hora:</strong> {formatFechaHora(turno.fechaYHora)}</p>
                            <p><strong>Estado:</strong> {turno.estado}</p>
                            <p><strong>DNI Paciente:</strong> {turno.dni}</p>
                            <p><strong>Apellido y Nombre:</strong> {turno.nomyapel}</p>
                        </ul>
                    ))
                ) : (
                    <p>No hay turnos para mostrar</p>
                )}
            </div>
            <button className="button" onClick={() => navigate('/doctor')}>Volver</button>
        </div>
    );
}
