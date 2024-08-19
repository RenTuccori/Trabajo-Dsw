import { useEffect, useState } from 'react';
import { getTurnosHistoricoDoctor } from '../api/turnos.api'; 
import { useNavigate } from 'react-router-dom';
import '../estilos/white-text.css';
import '../estilos/home.css';

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




/*
import { useEffect, useState } from 'react';
import { getTurnosHistoricoDoctor } from '../api/turnos.api'; 
import { useNavigate } from 'react-router-dom';
import '../estilos/white-text.css';
import '../estilos/home.css';

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
            <button onClick={() => navigate('/doctor')}>Volver</button>
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

/*
import { useState } from 'react';
import { getTurnosDoctor } from '../api/turnos.api'; 
import '../estilos/white-text.css';
import '../estilos/tarjetaturno.css';

export function VerTurnosDoctor() {
    const [dniDoctor, setDniDoctor] = useState('');
    const [contraseña, setContra] = useState('');
    const [turnos, setTurnos] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    const handleDniChange = (event) => {
        setDniDoctor(event.target.value);
    };

    const handleContraChange = (event) => {
        setContra(event.target.value);
    };

    const handleBuscarTurnos = async () => {
        setBusquedaRealizada(true);

        try {
            const response = await getTurnosDoctor({ dni: dniDoctor, contra: contraseña });
    
            if (response.data && response.data.length > 0) {
                console.log('Turnos obtenidos:', response.data);
                setTurnos(response.data);
            } else {
                console.log('No se encontraron turnos para el DNI proporcionado');
                setTurnos([]); 
            }
        } catch (error) {
            console.error('Error al obtener los turnos:', error);
            setTurnos([]); 
        }
    };

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
        <div className="container">
            <div className="form">
                <div className="input-group">
                    <p className="text">Ingrese su DNI</p>
                    <input
                        type="text"
                        value={dniDoctor}
                        onChange={handleDniChange}
                        placeholder="DNI"
                        className="dni-input"
                    />
                    <p className="text">Ingrese su Contraseña</p>
                    <input
                        type="password"
                        value={contraseña}
                        onChange={handleContraChange}
                        placeholder="Contraseña"
                        className="contra-input"
                    />
                </div>
                <button
                    className='button'
                    onClick={handleBuscarTurnos}
                    disabled={!dniDoctor || !contraseña}
                >
                    Buscar Turnos
                </button>

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
        </div>
    );
}

*/