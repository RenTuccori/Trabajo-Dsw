import { useEffect, useState } from 'react';
import { getTurnosDoctorHoy } from '../api/turnos.api'; 
import '../estilos/white-text.css';
import '../estilos/tarjetaturno.css';

export function VerTurnosDoctorHoy() {
    const [turnos, setTurnos] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    // Función para obtener turnos usando el idDoctor del localStorage
    const obtenerTurnos = async () => {
        const idDoctor = localStorage.getItem('idDoctor');
        console.log('ID del doctor:', idDoctor);
        if (idDoctor) {
            try {
                const response = await getTurnosDoctorHoy({ idDoctor });
    
                if (response.data && response.data.length > 0) {
                    console.log('Turnos obtenidos:', response.data);
                    setTurnos(response.data);
                } else {
                    console.log('No se encontraron turnos para el ID proporcionado');
                    setTurnos([]); 
                }
            } catch (error) {
                console.error('Error al obtener los turnos:', error);
                setTurnos([]); 
            }
        } else {
            console.error('ID del doctor no encontrado en localStorage');
        }
        setBusquedaRealizada(true);
    };

    // Llamar a obtenerTurnos cuando se monta el componente
    useEffect(() => {
        obtenerTurnos();
    }, []);

    const formatHora = (fechaYHora) => {
        const opciones = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        return new Date(fechaYHora).toLocaleTimeString('es-ES', opciones);
    };
    
    return (
        <div className="container">
            <div className="turnos-container">
                {busquedaRealizada && turnos.length > 0 ? (
                    turnos.map((turno, index) => (
                        <div key={index} className="turno-card">
                            <p><strong>Sede:</strong> {turno.sede}</p>
                            <p><strong>Especialidad:</strong> {turno.especialidad}</p>
                            <p><strong>Fecha y Hora:</strong> {formatHora(turno.fechaYHora)}</p>
                            <p><strong>Estado:</strong> {turno.estado}</p>
                            <p><strong>DNI Paciente:</strong> {turno.dni}</p>
                            <p><strong>Apellido y Nombre:</strong> {turno.nomyapel}</p>
                        </div>
                    ))
                ) : (
                    busquedaRealizada && <p>No hay turnos para mostrar</p>
                )}
            </div>
        </div>
    );
}

