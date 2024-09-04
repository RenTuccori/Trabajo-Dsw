import { useEffect, useState } from 'react';
import { useDoctores } from '../../context/doctores/DoctoresProvider.jsx'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import '../../estilos/sacarturno.css';
import '../../estilos/tarjetaturno.css';
import '../../estilos/home.css';

export function VerTurnosDoctorFecha() {
    const navigate = useNavigate();
    const [selectedFecha, setSelectedFecha] = useState(null);
    const {fechas,Historico, turnosFecha, Fecha, comprobarToken} = useDoctores();

    // Llamar a obtenerTurnos cuando se monta el componente
    useEffect(() => {
        comprobarToken();
        Historico();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const isDateAvailable = (date) => {
        return fechas.some(f => 
            f.getFullYear() === date.getFullYear() &&
            f.getMonth() === date.getMonth() &&
            f.getDate() === (date.getDate() -1)
        );
    };
    const handleDateChange = (date) => {
        setSelectedFecha(date);
        if (date) {
            console.log('Fecha seleccionada:', date);
            Fecha(date); // Llamar a la función Fecha con la fecha seleccionada
        }
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
                    onChange={handleDateChange}
                    filterDate={isDateAvailable}
                    placeholderText="Selecciona una fecha"
                />
            </div>
            {selectedFecha && (
                <div className="turnos-container">
                    {turnosFecha.length > 0 ? (
                        turnosFecha.map((turno, index) => (
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
                        <p>No hay turnos para mostrar</p>
                    )}
                </div>
            )}
        </div>
    );
}
