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
    <div className="page-bg flex items-center justify-center p-4">
      <div className="card p-8 space-y-5 animate-slide-up w-full max-w-md">
        <h1 className="section-title text-center">Turnos por Fecha</h1>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Seleccione una Fecha</label>
          <div className="w-full">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              filterDate={isDateAvailable}
              isClearable
              placeholderText="Haga clic para seleccionar"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white"
              wrapperClassName="w-full"
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        {selectedDate && (
          <div className="space-y-4">
            {appointmentsByDate.length > 0 ? (
              appointmentsByDate.map((appointment, index) => (
                <div
                  key={index}
                  className="appointment-card"
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
                  <p>
                    <strong>Estado:</strong> {t(`statuses.${appointment.status}`)}
                  </p>
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
        <button
          className="btn-secondary"
          onClick={() => navigate('../')}
        >
          Volver
        </button>
      </div>
    </div>
  );
}



