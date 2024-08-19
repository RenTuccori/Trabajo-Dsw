import { useEffect, useState } from 'react';
import { getTurnosHistoricoDoctor, getTurnosDoctorFecha } from '../api/turnos.api'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../estilos/white-text.css';
import '../estilos/tarjetaturno.css';
import '../estilos/home.css';

export function VerTurnosDoctorFecha() {
    const navigate = useNavigate();
    const [turnos, setTurnos] = useState([]);
    const [fechas, setFechas] = useState([]);
    const [selectedFecha, setSelectedFecha] = useState(null);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    // Función para obtener turnos históricos y fechas disponibles
    const obtenerTurnos = async () => {
        const idDoctor = localStorage.getItem('idDoctor');
        console.log('ID del doctor:', idDoctor);
        if (idDoctor) {
            try {
                const response = await getTurnosHistoricoDoctor({ idDoctor });
                if (response.data && response.data.length > 0) {
                    console.log('Turnos obtenidos:', response.data);
                    // Extraer y formatear las fechas disponibles
                    const fechasDisponibles = response.data.map(turno => new Date(turno.fechaYHora.split('T')[0]));
                    setFechas(fechasDisponibles);
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

    // Función para obtener turnos de una fecha específica
    const obtenerTurnosPorFecha = async (fecha) => {
        const idDoctor = localStorage.getItem('idDoctor');
        if (idDoctor && fecha) {
            // Convertir la fecha al formato yyyy-mm-dd
            const formattedDate = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
            console.log(formattedDate)
            try {
                const response = await getTurnosDoctorFecha({ idDoctor, fechaYHora: formattedDate });
                console.log('Turnos de la fecha obtenidos:', response.data);
                setTurnos(response.data);
            } catch (error) {
                console.error('Error al obtener los turnos por fecha:', error);
                setTurnos([]);
            }
        }
    };

    // Llamar a obtenerTurnos cuando se monta el componente
    useEffect(() => {
        obtenerTurnos();
    }, []);

    useEffect(() => {
        if (selectedFecha) {
            obtenerTurnosPorFecha(selectedFecha);
        }
    }, [selectedFecha]);

    const formatHora = (fechaYHora) => {
        const opciones = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZoneName: 'short'
        };
        return new Date(fechaYHora).toLocaleTimeString('es-ES', opciones);
    };

    const isDateAvailable = (date) => {
        return fechas.some(f => 
            f.getFullYear() === date.getFullYear() &&
            f.getMonth() === date.getMonth() &&
            f.getDate() === (date.getDate() -1)
        );
    };

    return (
        <div className="home-container">
            <div className="home-container">
                <button className="button" onClick={() => navigate('/doctor')}>Volver</button>
                <h1 className="text">Turnos</h1>
            </div>
            <div className="form">
                <p className='text'>Fecha</p>
                <DatePicker
                    selected={selectedFecha}
                    onChange={date => {
                        setSelectedFecha(date);
                        console.log('Fecha seleccionada:', date);
                        setTurnos([]); // Limpiar los turnos al seleccionar una nueva fecha
                    }}
                    filterDate={isDateAvailable}
                    placeholderText="Selecciona una fecha"
                />
            </div>
            {selectedFecha && (
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
            )}
        </div>
    );
}
