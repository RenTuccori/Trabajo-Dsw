/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '../../context/doctors/DoctorsProvider.jsx';
import '../../styles/home.css';
import '../../styles/bookAppointment.css';
import '../../styles/viewAppointments.css';

export function TodayAppointments() {
  const { todayAppointments, loadTodayAppointments } = useDoctors();
  const navigate = useNavigate();

  useEffect(() => {
    loadTodayAppointments();
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
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-800 text-center">
          Turnos de hoy
        </h1>
        <div className="space-y-4">
          {todayAppointments && todayAppointments.length > 0 ? (
            todayAppointments.map((appointment, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4"
              >
                <p>
                  <strong>Localidad:</strong> {appointment.location || appointment.venue}
                </p>
                <p>
                  <strong>Especialidad:</strong> {appointment.specialty}
                </p>
                <p>
                  <strong>Fecha y hora:</strong>{' '}
                  {formatFechaHora(appointment.dateTime)}
                </p>
                <p>
                  <strong>Estado:</strong> {appointment.status}
                </p>
                <p>
                  <strong>DNI del paciente:</strong> {appointment.nationalId}
                </p>
                <p>
                  <strong>Nombre completo:</strong> {appointment.patientName}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">
              No hay turnos para hoy
            </p>
          )}
        </div>
        <button
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={() => navigate('/doctor')}
        >
          Volver
        </button>
      </div>
    </div>
  );
}




