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

  const [turnoCreado, setTurnoCreado] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmarTurno = async () => {
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
        setTurnoCreado(true);
        setError(null);
      } catch (error) {
        console.error(
          '💥 FRONTEND - appointmentConfirmation: Error al crear el appointment:',
          error
        );
        setError(error.message || 'Error creating appointment');
        setTurnoCreado(false);
      }
    };

    confirmarTurno();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (turnoCreado && userEmail) {
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
    turnoCreado,
    userEmail,
    dateAndTime,
    doctorName,
    doctorLastName,
    specialtyName,
    locationName,
    locationAddress,
    sendEmailFunction,
  ]); // Este efecto se ejecuta solo cuando `userEmail` y `turnoCreado` están listos

  return (
    <div className="page-bg p-6 lg:p-10 flex items-center justify-center min-h-[80vh]">
      <div className="glass-solid p-8 lg:p-10 rounded-3xl shadow-glass animate-slide-up w-full max-w-md text-center">
        {error ? (
          <>
            <div className="w-16 h-16 bg-coral-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Error creando turno</h1>
            <p className="text-red-600 text-center">{error}</p>
            <button
              className="btn-primary w-full mt-6"
              onClick={() => navigate('/patient/bookAppointment')}
            >
              Volver a intentar
            </button>
          </>
        ) : turnoCreado ? (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Turno creado exitosamente</h1>
            <div className="text-left space-y-2 bg-gray-50/80 rounded-2xl p-4 mb-4">
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
            </div>
            <p className="text-sm text-gray-600 text-center mt-4">
              Se ha enviado un email de confirmación a {userEmail}. Si no lo recibiste, verifica tu carpeta de spam.
            </p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
              <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-4">Creando turno...</h1>
            <p className="text-gray-700 text-center">Por favor espera mientras se procesa tu turno.</p>
          </>
        )}

        <button
          className="btn-primary w-full mt-6"
          onClick={() => navigate('/patient')}
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
