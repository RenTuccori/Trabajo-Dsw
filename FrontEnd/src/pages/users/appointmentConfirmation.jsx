import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '../../context/patients/PatientsProvider.jsx';

export function AppointmentConfirmation() {
  const navigate = useNavigate();
  const {
    specialtyName,
    doctorName,
    doctorLastName,
    locationName,
    locationAddress,
    dateAndTime,
    createAppointment,
    getDoctorByIdFunction,
    getSpecialtyByIdFunc,
    getLocationByIdFunc,
    status,
    userEmail,
    getUserByNationalIdFunction,
    sendEmailFunction,
  } = usePatients();
  const { t } = useTranslation();

  const [appointmentCreated, setAppointmentCreated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmAppointment = async () => {
      try {
        // Get user data first
        await getUserByNationalIdFunction();

        // Ensure readable names are loaded into context before creating the appointment
        try {
          await Promise.all([
            getDoctorByIdFunction(),
            getSpecialtyByIdFunc(),
            getLocationByIdFunc(),
          ]);
        } catch (err) {
          console.warn('⚠️ FRONTEND - appointmentConfirmation: Could not load all names', err);
        }
        // Create the appointment - all data should already be in context from bookAppointment
        const result = await createAppointment();
        setAppointmentCreated(true);
        setError(null);
      } catch (error) {
        console.error(
          'appointmentConfirmation: Error creating the appointment:',
          error
        );
        setError(error.message || 'Error al crear el turno');
        setAppointmentCreated(false);
      }
    };

    confirmAppointment();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (appointmentCreated && userEmail) {
      // Construir el cuerpo del correo como string HTML
      const cuerpo = `
            <div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #1c4e80; text-align: center;">¡Su turno ha sido creado exitosamente!</h1>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
                    <p><strong>Fecha y hora:</strong> ${dateAndTime}</p>
                    <p><strong>Especialidad:</strong> ${t(`specialties.${specialtyName}`, { defaultValue: specialtyName })}</p>
                    <p><strong>Médico:</strong> ${doctorName} ${doctorLastName}</p>
                    <p><strong>Localidad:</strong> ${t(`locations.${locationName}`, { defaultValue: locationName })}, ${locationAddress}</p>
                </div>
                <footer style="text-align: center;">
                    <p>¡Hasta pronto, gracias por confiar en nosotros!</p>
                    <p>Sanatorio UTN</p>
                </footer>
            </div>`;

      // Send confirmation email
      sendEmailFunction({
        to: userEmail, // Pass the recipient
        subject: 'Turno creado',
        html: cuerpo,
      });
    }
  }, [
    appointmentCreated,
    userEmail,
    dateAndTime,
    doctorName,
    doctorLastName,
    specialtyName,
    locationName,
    locationAddress,
    sendEmailFunction,
  ]); // This effect runs only when `userEmail` and `appointmentCreated` are ready

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-800 text-center">Error al crear el turno</h1>
            <p className="text-red-600 text-center">{error}</p>
            <button
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/patient/bookAppointment')}
            >
              Reintentar
            </button>
          </>
        ) : appointmentCreated ? (
          <>
            <h1 className="text-2xl font-bold text-green-800 text-center">✅ Turno creado exitosamente</h1>
            <p className="text-gray-700">
              <strong>Fecha y hora:</strong> {dateAndTime}
            </p>
            <p className="text-gray-700">
              <strong>Especialidad:</strong> {t(`specialties.${specialtyName}`, { defaultValue: specialtyName })}
            </p>
            <p className="text-gray-700">
              <strong>Médico:</strong> {doctorName} {doctorLastName}
            </p>
            <p className="text-gray-700">
              <strong>Localidad:</strong> {t(`locations.${locationName}`, { defaultValue: locationName })}, {locationAddress}
            </p>
            <p className="text-gray-700">
              <strong>Estado:</strong> {t(`statuses.${status || 'Pending'}`, { defaultValue: status || 'Pending' })}
            </p>
            <p className="text-sm text-gray-600 text-center mt-4">
              Se envió un correo de confirmación a {userEmail}. Si no lo recibiste, revisa tu carpeta de spam.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-blue-800 text-center">Creando turno...</h1>
            <p className="text-gray-700 text-center">Por favor espere mientras se procesa su turno.</p>
          </>
        )}

        <button
          className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => navigate('/patient')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
