import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../context/paciente/PacientesProvider.jsx';

export function ConfirmacionTurno() {
  const navigate = useNavigate();
  const {
    specialtyName,
    doctorName,
    doctorLastName,
    locationName,
    locationAddress,
    dateAndTime,
    createNewAppointment,
    fetchDoctorById,
    fetchSpecialtyById,
    fetchLocationById,
    userEmail,
    fetchUserByDni,
    sendEmailAction,
  } = usePacientes();

  const [turnoCreado, setTurnoCreado] = useState(false); // State to track if the appointment was created

  useEffect(() => {
    const confirmarTurno = async () => {
      try {
        // Ensure all async functions complete before continuing
        await fetchUserByDni();
        await fetchDoctorById();
        await fetchSpecialtyById();
        await fetchLocationById();

        // Create appointment
        await createNewAppointment();
        setTurnoCreado(true);
      } catch (error) {
        window.notifyError('Error al crear el turno');
      }
    };

    confirmarTurno();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (turnoCreado && userEmail) {
      // Build the email body as an HTML string
      const cuerpo = `
            <div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #1c4e80; text-align: center;">¡Tu turno ha sido creado con éxito!</h1>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px;">
                    <p><strong>Fecha y Hora:</strong> ${dateAndTime}</p>
                    <p><strong>Especialidad:</strong> ${specialtyName}</p>
                    <p><strong>Doctor:</strong> ${doctorName} ${doctorLastName}</p>
                    <p><strong>Sede:</strong> ${locationName}, ${locationAddress}</p>
                </div>
                <footer style="text-align: center;">
                    <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                    <p>Sanatorio UTN</p>
                </footer>
            </div>`;

      // Call the function to send the email
      sendEmailAction({
        to: userEmail, // Make sure to pass the recipient
        subject: 'Turno Creado',
        html: cuerpo,
      });
    }
  }, [turnoCreado, userEmail]); // This effect runs only when `userEmail` and `turnoCreado` are ready

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold text-blue-800 text-center">
          Turno creado
        </h1>
        <p className="text-gray-700">
          <strong>Fecha y Hora:</strong> {dateAndTime}
        </p>
        <p className="text-gray-700">
          <strong>Especialidad:</strong> {specialtyName}
        </p>
        <p className="text-gray-700">
          <strong>Doctor:</strong> {doctorName} {doctorLastName}
        </p>
        <p className="text-gray-700">
          <strong>Sede:</strong> {locationName}, {locationAddress}
        </p>
        <p className="text-gray-700">
          <strong>Estado:</strong> Pendiente
        </p>

        {/* Email notice */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Si no recibiste el correo de confirmación, por favor verifica tu
          dirección de correo en la sección de <strong>Datos Personales</strong>{' '}
          y asegúrate de que sea correcta.
        </p>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => navigate('/paciente')}
      >
        Volver
      </button>
    </div>
  );
}
