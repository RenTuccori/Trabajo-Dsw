import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../context/paciente/PacientesProvider';
import { toast } from 'react-toastify'; // Importa toastify
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de toastify
import Swal from 'sweetalert2'; // Importa SweetAlert2

export function TurnosPersonales() {
    const navigate = useNavigate();
    const { ObtenerTurnosPaciente, ConfirmarTurno, CancelarTurno, turnos, comprobarToken } = usePacientes();

    useEffect(() => {
        comprobarToken();
        ObtenerTurnosPaciente();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleConfirmarTurno = async (idTurno) => {
        const result = await Swal.fire({
            title: 'Confirmar Turno',
            text: '¿Estás seguro que deseas confirmar este turno?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await ConfirmarTurno({ idTurno });
                toast.success('¡Turno confirmado con éxito!'); // Mensaje de éxito
            } catch (error) {
                toast.error('Error al confirmar el turno'); // Mensaje de error
                console.error('Error al confirmar turno:', error);
            }
        }
    };

    const handleCancelarTurno = async (idTurno) => {
        const result = await Swal.fire({
            title: 'Cancelar Turno',
            text: '¿Estás seguro que deseas cancelar este turno?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cancelar',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            try {
                await CancelarTurno({ idTurno });
                toast.success('¡Turno cancelado con éxito!'); // Mensaje de éxito
            } catch (error) {
                toast.error('Error al cancelar el turno'); // Mensaje de error
                console.error('Error al cancelar turno:', error);
            }
        }
    };

    const formatFechaHora = (fechaHora) => {
        const date = new Date(fechaHora);
        const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
        const opcionesHora = { hour: '2-digit', minute: '2-digit' };

        const fecha = date.toLocaleDateString('es-ES', opcionesFecha);
        const hora = date.toLocaleTimeString('es-ES', opcionesHora);

        return `${fecha} a las ${hora}`; // Retorna la fecha y hora en un solo string
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
                <button
                    onClick={() => navigate('/paciente')}
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                    Volver
                </button>
                {turnos.length > 0 ? (
                    turnos.map((turno, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4">
                            <p><strong>Sede:</strong> {turno.Sede}</p>
                            <p><strong>Dirección:</strong> {turno.Direccion}</p>
                            <p><strong>Especialidad:</strong> {turno.Especialidad}</p>
                            <p><strong>Fecha y Hora:</strong> {formatFechaHora(turno.fecha_hora)}</p>
                            <p><strong>Doctor:</strong> {turno.Doctor}</p>
                            <p><strong>DNI Paciente:</strong> {turno.dni}</p>
                            <p><strong>Estado:</strong> {turno.estado}</p>
                            <div className="flex space-x-2 mt-4">
                                <button
                                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                    onClick={() => handleConfirmarTurno(turno.idTurno)}
                                    disabled={turno.estado === 'Confirmado' || turno.estado === 'Cancelado'}
                                >
                                    Confirmar
                                </button>
                                <button
                                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                    onClick={() => handleCancelarTurno(turno.idTurno)}
                                    disabled={turno.estado === 'Cancelado'}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-600">No hay turnos para mostrar</p>
                )}
            </div>
        </div>
    );
}
