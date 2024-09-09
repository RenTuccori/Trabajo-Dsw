import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';
import '../../estilos/verTurnos.css';

export function TurnosPersonales() {
    const navigate = useNavigate();
    const { ObtenerTurnosPaciente, ConfirmarTurno, CancelarTurno,turnos,comprobarToken } = usePacientes();

    useEffect(() => {
        comprobarToken();
        ObtenerTurnosPaciente();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleConfirmarTurno = async (idTurno) => {
        ConfirmarTurno({ idTurno });
    };

    const handleCancelarTurno = async (idTurno) => {
        CancelarTurno({ idTurno });
    };

    const formatFechaHora = (fechaHora) => {
        const date = new Date(fechaHora);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
            <div className="lista-wrapper">
                <div className="turnos-lista">
                {turnos.length > 0 ? (
                    turnos.map((turno, index) => (
                        <div key={index} className="turno-item">
                            <p><strong>Sede:</strong> {turno.Sede}</p>
                            <p><strong>Dirección:</strong> {turno.Direccion}</p>
                            <p><strong>Especialidad:</strong> {turno.Especialidad}</p>
                            <p><strong>Fecha y Hora:</strong> {formatFechaHora(turno.fecha_hora)}</p>
                            <p><strong>Doctor:</strong> {turno.Doctor}</p>
                            <p><strong>DNI Paciente:</strong> {turno.dni}</p>
                            <p><strong>Estado:</strong> {turno.estado}</p>
                            <button className='button'
                                onClick={() => handleConfirmarTurno(turno.idTurno)}
                                disabled={turno.estado === 'Confirmado' || turno.estado === 'Cancelado'}
                            >
                                Confirmar
                            </button>
                            <button className='button-cancelar'
                                
                                onClick={() => handleCancelarTurno(turno.idTurno)}
                                disabled={turno.estado === 'Cancelado'}
                            >
                                Cancelar
                            </button>

                        </div>

                    ))
                ) : (
                    <p>No hay turnos para mostrar</p>
                )}
                </div>
                <button onClick={() => navigate('/paciente')}>Volver</button>
            </div>
    );
}




