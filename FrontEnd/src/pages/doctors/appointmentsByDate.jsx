import { useEffect, useState } from 'react';
import { useDoctors } from '../../context/doctors/DoctorsProvider.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function AppointmentsByDate() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(null);
  const {
    availableDates,
    loadHistoricalAppointments,
    appointmentsByDate,
    loadAppointmentsByDate,
  } = useDoctors();

  // Llamar a obtenerTurnos cuando se monta el componente
  useEffect(() => {
    loadHistoricalAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatHora = (dateAndTime) => {
    const opciones = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };
    return new Date(dateAndTime).toLocaleTimeString('es-ES', opciones);
  };

  const isDateAvailable = (date) => {
    return availableDates.some(
      (f) =>
        f.getFullYear() === date.getFullYear() &&
        f.getMonth() === date.getMonth() &&
        f.getDate() === date.getDate()
    );
  };
  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (date) {
      loadAppointmentsByDate(date);
    } else {
      loadAppointmentsByDate(null);
    }
  };
  return (
    <div className="page-bg p-6 lg:p-10">
      <div className="max-w-3xl mx-auto animate-slide-up">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 tracking-tight">Turnos por fecha</h1>
            <p className="text-gray-500 text-sm mt-1">Buscá turnos en una fecha específica</p>
          </div>
          <button className="btn-ghost" onClick={() => navigate('../')}>← Volver</button>
        </div>
        <div className="glass-solid rounded-2xl p-6 mb-6">
        <div className="space-y-2">
          <label className="label">Seleccione una Fecha</label>
          <div className="w-full">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              filterDate={isDateAvailable}
              isClearable
              placeholderText="Haga clic para seleccionar"
              className="input w-full cursor-pointer"
              wrapperClassName="w-full"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        </div>
        {selectedDate && (
          <div className="space-y-4">
            {appointmentsByDate.length > 0 ? (
              appointmentsByDate.map((appointment, index) => (
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
                    <strong>Hora:</strong> {formatHora(appointment.dateTime)}
                  </p>
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-600">Estado:</strong>
                    <span className={`badge ${appointment.status === 'Confirmed' ? 'badge-confirmed' : appointment.status === 'Cancelled' ? 'badge-cancelled' : 'badge-pending'}`}>{t(`statuses.${appointment.status}`)}</span>
                  </div>
                  <p>
                    <strong>DNI Paciente:</strong> {appointment.dni || appointment.nationalId || '-'}
                  </p>
                  <p>
                    <strong>Apellido y Nombre:</strong> {appointment.patientName || appointment.fullName || '-'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">
                No hay turnos para mostrar en esta fecha
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}



