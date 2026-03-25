import { useEffect, useState } from 'react';
import { useDoctors } from '../../context/doctors/DoctorsProvider.jsx';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNavigate } from 'react-router-dom';

export function AppointmentsByDate() {
  const navigate = useNavigate();
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
      console.log('Fecha seleccionada:', date);
      loadAppointmentsByDate(date);
    } else {
      loadAppointmentsByDate(null);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-800 text-center">Turnos</h1>
        <div className="space-y-4">
          <p className="text-center text-gray-600">Fecha</p>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            filterDate={isDateAvailable}
            isClearable
            placeholderText="Selecciona una fecha"
            className="w-full border border-gray-300 rounded-lg p-2"
          />
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
                    <strong>Localidad:</strong> {appointment.location || appointment.venue}
                  </p>
                  <p>
                    <strong>Especialidad:</strong> {appointment.specialty}
                  </p>
                  <p>
                    <strong>Hora:</strong> {formatHora(appointment.dateTime)}
                  </p>
                  <p>
                    <strong>Estado:</strong> {appointment.status}
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
                No hay appointments para mostrar
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



