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
        console.log('🎯 FRONTEND - appointmentConfirmation: Getting user data');
        // Get user data first
        await getUserByNationalIdFunction();

        // Ensure readable names are loaded into context before creating the appointment
        try {
          await Promise.all([
            getDoctorByIdFunction(),
            getSpecialtyByIdFunc(),
            getLocationByIdFunc(),
          ]);
          console.log('✅ FRONTEND - appointmentConfirmation: Names loaded into context');
        } catch (err) {
          console.warn('⚠️ FRONTEND - appointmentConfirmation: Could not load all names', err);
        }

        console.log('🎯 FRONTEND - appointmentConfirmation: Creating appointment');
        // Create the appointment - all data should already be in context from bookAppointment
        const result = await createAppointment();
        console.log('✅ FRONTEND - appointmentConfirmation: Appointment created!', result);
        setAppointmentCreated(true);
        setError(null);
      } catch (error) {
        console.error(
          '💥 FRONTEND - appointmentConfirmation: Error al crear el appointment:',
          error
        );
        setError(error.message || 'Error creating appointment');
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
                <h1 style="color: #1c4e80; text-align: center;">¡Tu appointment ha sido creado con éxito!</h1>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
                    <p><strong>Fecha y Hora:</strong> ${dateAndTime}</p>
                    <p><strong>Especialidad:</strong> ${t(`specialties.${specialtyName}`, { defaultValue: specialtyName })}</p>
                    <p><strong>Doctor:</strong> ${doctorName} ${doctorLastName}</p>
                    <p><strong>Sede:</strong> ${t(`locations.${locationName}`, { defaultValue: locationName })}, ${locationAddress}</p>
                </div>
                <footer style="text-align: center;">
                    <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                    <p>Sanatorio UTN</p>
                </footer>
            </div>`;

      // Llamar a la función para mandar el correo
      console.log(
        '📧 FRONTEND - appointmentConfirmation: Enviando email de confirmación'
      );
      sendEmailFunction({
        to: userEmail, // Asegúrate de pasar el destinatario como tal
        subject: 'Turno Creado',
        html: cuerpo,
      });
      console.log(
        '✅ FRONTEND - appointmentConfirmation: Email enviado exitosamente'
      );
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
  ]); // Este efecto se ejecuta solo cuando `userEmail` y `appointmentCreated` están listos

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        {error ? (
          <>
            <h1 className="text-2xl font-bold text-red-800 text-center">Error creando turno</h1>
            <p className="text-red-600 text-center">{error}</p>
            <button
              className="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/patient/bookAppointment')}
            >
              Volver a intentar
            </button>
          </>
        ) : appointmentCreated ? (
          <>
            <h1 className="text-2xl font-bold text-green-800 text-center">✅ Turno creado exitosamente</h1>
            <p className="text-gray-700">
              <strong>Fecha y Hora:</strong> {dateAndTime}
            </p>
            <p className="text-gray-700">
              <strong>Especialidad:</strong> {t(`specialties.${specialtyName}`, { defaultValue: specialtyName })}
            </p>
            <p className="text-gray-700">
              <strong>Doctor:</strong> {doctorName} {doctorLastName}
            </p>
            <p className="text-gray-700">
              <strong>Sede:</strong> {t(`locations.${locationName}`, { defaultValue: locationName })}, {locationAddress}
            </p>
            <p className="text-gray-700">
              <strong>Estado:</strong> {t(`statuses.${status || 'Pending'}`, { defaultValue: status || 'Pending' })}
            </p>
            <p className="text-sm text-gray-600 text-center mt-4">
              Se ha enviado un email de confirmación a {userEmail}. Si no lo recibiste, verifica tu carpeta de spam.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-blue-800 text-center">Creando turno...</h1>
            <p className="text-gray-700 text-center">Por favor espera mientras se procesa tu appointment.</p>
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
