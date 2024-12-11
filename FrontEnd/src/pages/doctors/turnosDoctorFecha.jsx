import { useEffect, useState } from 'react';
import { useDoctores } from '../../context/doctores/DoctoresProvider.jsx';
import { useAuth } from '../../context/global/AuthProvider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';



export function VerTurnosDoctorFecha() {
    const navigate = useNavigate();
    const [selectedFecha, setSelectedFecha] = useState(null);
    const { fechas, Historico, turnosFecha, Fecha} = useDoctores();
      const {
    comprobarToken
  } = useAuth();

    // Llamar a obtenerTurnos cuando se monta el componente
    useEffect(() => {
        comprobarToken('D');
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
            f.getDate() === (date.getDate() - 1)
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
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
                <h1 className="text-2xl font-bold text-blue-800 text-center">Turnos</h1>
                {!selectedFecha && (
                    <div className="space-y-4">
                        <p className='text-center text-gray-600'>Fecha</p>
                        <DatePicker
                            selected={selectedFecha}
                            onChange={handleDateChange}
                            filterDate={isDateAvailable}
                            placeholderText="Selecciona una fecha"
                            className="w-full border border-gray-300 rounded-lg p-2"
                        />
                    </div>
                )}
                {selectedFecha && (
                    <div className="space-y-4">
                        {turnosFecha.length > 0 ? (
                            turnosFecha.map((turno, index) => (
                                <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4">
                                    <p><strong>Sede:</strong> {turno.sede}</p>
                                    <p><strong>Especialidad:</strong> {turno.especialidad}</p>
                                    <p><strong>Hora:</strong> {formatHora(turno.fechaYHora)}</p>
                                    <p><strong>Estado:</strong> {turno.estado}</p>
                                    <p><strong>DNI Paciente:</strong> {turno.dni}</p>
                                    <p><strong>Apellido y Nombre:</strong> {turno.nomyapel}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">No hay turnos para mostrar</p>
                        )}
                    </div>
                )}
                <button
                    className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    onClick={() => navigate('../')}
                >
                    Volver
                </button>
            </div>
        </div>
    );
}
