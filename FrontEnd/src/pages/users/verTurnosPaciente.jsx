import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTurnosPaciente, confirmarTurno, cancelarTurno } from '../../api/turnos.api';
import '../../estilos/tarjetaturno.css';


export function TurnosPersonales() {
    const [turnos, setTurnos] = useState([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dni: '',
        fechaNacimiento: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleCheckUser = async (e) => {
        e.preventDefault();
        const { dni, fechaNacimiento } = formData;
        const response = await getTurnosPaciente({ dni, fechaNacimiento });

        if (response.data && response.data.length > 0) {
            setTurnos(response.data);
            setBusquedaRealizada(true);
        } else {
            console.log('No se encontraron turnos para el paciente');
            setBusquedaRealizada(true);
        }
    };

    const handleConfirmarTurno = async (idTurno) => {
        try {
            await confirmarTurno({ idTurno });
            setTurnos(prevTurnos =>
                prevTurnos.map(turno =>
                    turno.idTurno === idTurno ? { ...turno, estado: 'Confirmado' } : turno
                )
            );
        } catch (error) {
            console.error('Error al confirmar el turno:', error);
        }
    };

    const handleCancelarTurno = async (idTurno) => {
        try {
            await cancelarTurno({ idTurno });
            setTurnos(prevTurnos =>
                prevTurnos.map(turno =>
                    turno.idTurno === idTurno ? { ...turno, estado: 'Cancelado' } : turno
                )
            );
        } catch (error) {
            console.error('Error al cancelar el turno:', error);
        }
    };

    const formatFechaHora = (fechaHora) => {
        const date = new Date(fechaHora);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="home-container">
            <form onSubmit={handleCheckUser} className='form'>
                <p>DNI</p>
                <input
                    type="text"
                    name="dni"
                    placeholder="DNI"
                    value={formData.dni}
                    onChange={handleInputChange}
                    required
                />
                <p>Fecha de Nacimiento</p>
                <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleInputChange}
                    required
                />
                <button type="submit">Buscar Turnos</button>
            </form>
            <div className="turnos-container">
                {busquedaRealizada && turnos.length > 0 ? (
                    turnos.map((turno, index) => (
                        <div key={index} className="turno-card">
                            <p><strong>Sede:</strong> {turno.Sede}</p>
                            <p><strong>Dirección:</strong> {turno.Direccion}</p>
                            <p><strong>Especialidad:</strong> {turno.Especialidad}</p>
                            <p><strong>Fecha y Hora:</strong> {formatFechaHora(turno.fecha_hora)}</p>
                            <p><strong>Doctor:</strong> {turno.Doctor}</p>
                            <p><strong>DNI Paciente:</strong> {turno.dni}</p>
                            <p><strong>Estado:</strong> {turno.estado}</p>
                            <button
                                onClick={() => handleConfirmarTurno(turno.idTurno)}
                                disabled={turno.estado === 'Confirmado' || turno.estado === 'Cancelado'}
                            >
                                Confirmar
                            </button>
                            <button
                                onClick={() => handleCancelarTurno(turno.idTurno)}
                                disabled={turno.estado === 'Cancelado'}
                            >
                                Cancelar
                            </button>

                        </div>

                    ))
                ) : (
                    busquedaRealizada && <p>No hay turnos para mostrar</p>
                )}
                <button onClick={() => navigate('/paciente')}>Volver</button>
            </div>

        </div>
    );
}




