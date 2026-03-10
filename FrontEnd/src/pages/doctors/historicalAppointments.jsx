/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctores } from '../../context/doctors/DoctorsProvider.jsx';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';

export function HistoricalAppointments() {
  const { turnosHist, Historico } = useDoctores();
  const navigate = useNavigate();

  useEffect(() => {
    Historico();
  }, []);

  const formatFechaHora = (dateAndTime) => {
    const opciones = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };
    return new Date(dateAndTime).toLocaleString('es-ES', opciones);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-800 text-center">
          Historial de Turnos
        </h1>
        <button
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={() => navigate('/doctor')}
        >
          Volver
        </button>
        <div className="space-y-4">
          {turnosHist && turnosHist.length > 0 ? (
            turnosHist.map((appointment, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4"
              >
                <p>
                  <strong>Sede:</strong> {appointment.venue}
                </p>
                <p>
                  <strong>Especialidad:</strong> {appointment.specialty}
                </p>
                <p>
                  <strong>Fecha y Hora:</strong>{' '}
                  {formatFechaHora(appointment.dateTime)}
                </p>
                <p>
                  <strong>Estado:</strong> {appointment.status}
                </p>
                <p>
                  <strong>DNI Paciente:</strong> {appointment.dni}
                </p>
                <p>
                  <strong>Apellido y Nombre:</strong> {appointment.patientName}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay appointments para mostrar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}




