/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '../../context/doctors/DoctorsProvider.jsx';
import { useTranslation } from 'react-i18next';

export function HistoricalAppointments() {
  const { historicalAppointments, loadHistoricalAppointments } = useDoctors();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistoricalAppointments();
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
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Historial de turnos</h1>
            <p className="text-gray-500 text-sm mt-1">Todos tus turnos anteriores</p>
          </div>
          <button className="btn-ghost" onClick={() => navigate('/doctor')}>← Volver</button>
        </div>
        <div className="space-y-4">
          {historicalAppointments && historicalAppointments.length > 0 ? (
            historicalAppointments.map((appointment, index) => (
              <div
                key={index}
                className="glass-solid rounded-2xl p-6 space-y-2 mb-4"
              >
                <p>
                  <strong>Localidad:</strong> {t(`locations.${appointment.location || appointment.venue}`)}
                </p>
                <p>
                  <strong>Especialidad:</strong> {t(`specialties.${appointment.specialty}`)}
                </p>
                <p>
                  <strong>Fecha y Hora:</strong>{' '}
                  {formatFechaHora(appointment.dateTime)}
                </p>
                <div className="flex items-center gap-2">
                  <strong className="text-gray-600">Estado:</strong>
                  <span className={`badge ${appointment.status === 'Confirmed' ? 'badge-confirmed' : appointment.status === 'Cancelled' ? 'badge-cancelled' : 'badge-pending'}`}>{t(`statuses.${appointment.status}`)}</span>
                </div>
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
              No hay turnos para mostrar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}




