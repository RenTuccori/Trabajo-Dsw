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

  // Load appointments when component mounts
  useEffect(() => {
    loadHistoricalAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (dateAndTime) => {
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    };
    return new Date(dateAndTime).toLocaleTimeString('es-ES', options);
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
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-800 text-center">Turnos por Fecha</h1>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Seleccionar una fecha</label>
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
                  className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4"
                >
                  <p>
                    <strong>Localidad:</strong> {t(`locations.${appointment.location || appointment.venue}`)}
                  </p>
                  <p>
                    <strong>Especialidad:</strong> {t(`specialties.${appointment.specialty}`)}
                  </p>
                  <p>
                    <strong>Hora:</strong> {formatTime(appointment.dateTime)}
                  </p>
                  <p>
                    <strong>Estado:</strong> {t(`statuses.${appointment.status}`)}
                  </p>
                  <p>
                    <strong>DNI del paciente:</strong> {appointment.nationalId || '-'}
                  </p>
                  <p>
                    <strong>Nombre completo:</strong> {appointment.patientName || appointment.fullName || '-'}
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
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
          onClick={() => navigate('../')}
        >
          Volver
        </button>
      </div>
    </div>
  );
}



