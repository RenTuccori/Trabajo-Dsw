/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '../../context/doctors/DoctorsProvider.jsx';
import '../../estilos/home.css';
import '../../estilos/sacarturno.css';
import '../../estilos/verTurnos.css';

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
    <div className="page-bg flex items-center justify-center p-4">
      <div className="card p-8 space-y-5 animate-slide-up w-full max-w-md">
        <h1 className="section-title text-center">
          Turnos de Hoy
        </h1>
        <div className="space-y-4">
          {todayAppointments && todayAppointments.length > 0 ? (
            todayAppointments.map((appointment, index) => (
              <div
                key={index}
                className="appointment-card"
              >
                <p>
                  <strong>Localidad:</strong> {appointment.location || appointment.venue}
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
              No hay turnos para hoy
            </p>
          )}
        </div>
        <button
          className="btn-secondary"
          onClick={() => navigate('/doctor')}
        >
          Volver
        </button>
      </div>
    </div>
  );
}




