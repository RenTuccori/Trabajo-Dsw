import { useEffect} from 'react';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';
import { useNavigate } from 'react-router-dom';

export function ConfirmacionTurno() {
    const navigate = useNavigate();
    const {nombreEspecialidad, nombreDoctor, apellidoDoctor, nombreSede, direccionSede, fechaYHora,CrearTurno,comprobarToken, ObtenerDoctorId, 
        ObtenerEspecialidadId, ObtenerSedeId} = usePacientes();

    useEffect(() => {
        comprobarToken();
        ObtenerDoctorId();
        ObtenerEspecialidadId();
        ObtenerSedeId();
        CrearTurno();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='container'>
            <div className='turno-card'>
                <h1>Turno confirmado:</h1>
                <p>
                    <strong>Fecha y Hora:</strong> {fechaYHora}
                </p>
                <p>
                    <strong>Especialidad:</strong> {nombreEspecialidad}
                </p>
                <p>
                    <strong>Doctor:</strong> {nombreDoctor} {apellidoDoctor}
                </p>
                <p>
                    <strong>Sede:</strong> {nombreSede}, {direccionSede}
                </p>
                <p>
                    <strong>Estado:</strong> Pendiente
                </p>
            </div>
            <button className='button' onClick={() => navigate('/paciente')}>
                Volver
            </button>
        </div>
    );
}