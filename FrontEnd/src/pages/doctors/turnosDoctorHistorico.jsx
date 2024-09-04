import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctores } from '../../context/doctores/DoctoresProvider.jsx';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';

export function VerTurnosDoctorHistorico() {
  const {turnosHist , Historico, comprobarToken} = useDoctores();
  const navigate = useNavigate();

  console.log(turnosHist)

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





/*
import { useEffect, useState } from 'react';
import { getTurnosHistoricoDoctor } from '../../api/turnos.api'; 
import { useNavigate } from 'react-router-dom';
import '../../estilos/sacarturno.css';
import '../../estilos/home.css';

export function VerTurnosDoctorHistorico() {
    const [turnos, setTurnos] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const navigate = useNavigate();

    // Función para obtener turnos usando el idDoctor del localStorage
    const obtenerTurnos = async () => {
        const idDoctor = localStorage.getItem('idDoctor');
        console.log('ID del doctor:', idDoctor);
        if (idDoctor) {
            try {
                const response = await getTurnosHistoricoDoctor({ idDoctor });
    
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
                {busquedaRealizada && turnos.length > 0 ? (
                    turnos.map((turno, index) => (
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
                    busquedaRealizada && <p>No hay turnos para mostrar</p>
                )}
            </div>
            </div>
    );
}


*/
