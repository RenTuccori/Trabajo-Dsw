import { useEffect } from 'react';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';
import { useNavigate } from 'react-router-dom';

export function ConfirmacionTurno() {
    const navigate = useNavigate();
    const { nombreEspecialidad, nombreDoctor, apellidoDoctor, nombreSede, direccionSede, fechaYHora, CrearTurno, comprobarToken, ObtenerDoctorId,
        ObtenerEspecialidadId, ObtenerSedeId } = usePacientes();

    useEffect(() => {
        comprobarToken();
        ObtenerDoctorId();
        ObtenerEspecialidadId();
        ObtenerSedeId();
        CrearTurno();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
                <h1 className="text-2xl font-bold text-blue-800 text-center">Turno confirmado</h1>
                <p className="text-gray-700">
                    <strong>Fecha y Hora:</strong> {fechaYHora}
                </p>
                <p className="text-gray-700">
                    <strong>Especialidad:</strong> {nombreEspecialidad}
                </p>
                <p className="text-gray-700">
                    <strong>Doctor:</strong> {nombreDoctor} {apellidoDoctor}
                </p>
                <p className="text-gray-700">
                    <strong>Sede:</strong> {nombreSede}, {direccionSede}
                </p>
                <p className="text-gray-700">
                    <strong>Estado:</strong> Pendiente
                </p>
            </div>
            <button
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => navigate('/paciente')}
            >
                Volver
            </button>
        </div>
    );
}