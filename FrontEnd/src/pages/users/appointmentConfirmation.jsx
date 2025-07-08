import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../context/patients/PatientsProvider.jsx';

export function AppointmentConfirmation() {
  const navigate = useNavigate();
  const {
    specialtyName,
    doctorName,
    doctorLastName,
    venueName,
    venueAddress,
    dateAndTime,
    createAppointment,
    getDoctorByIdFunction,
    getSpecialtyById,
    getVenueById,
    userEmail,
    getUserByDniFunction,
    getPatientByDni,
    sendEmailFunction,
  } = usePacientes();

  const [turnoCreado, setTurnoCreado] = useState(false); // Estado para saber si el appointment fue creado

  useEffect(() => {
    const confirmarTurno = async () => {
      try {
        console.log('🎯 FRONTEND - appointmentConfirmation: Iniciando confirmación de turno');
        // Asegurarse de que todas las funciones asincrónicas se completen antes de continuar
        await getUserByDniFunction();
        await getPatientByDni(); // Añadir esta línea para obtener el patientId
        await getDoctorByIdFunction();
        await getSpecialtyById();
        await getVenueById();

        // Crear appointment
        console.log('📝 FRONTEND - appointmentConfirmation: Creando appointment');
        await createAppointment();
        console.log('✅ FRONTEND - appointmentConfirmation: Appointment creado exitosamente');
        setTurnoCreado(true);
      } catch (error) {
        console.error('💥 FRONTEND - appointmentConfirmation: Error al crear el appointment:', error);
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
                    <p><strong>Especialidad:</strong> ${specialtyName}</p>
                    <p><strong>Doctor:</strong> ${doctorName} ${doctorLastName}</p>
                    <p><strong>Sede:</strong> ${venueName}, ${venueAddress}</p>
                </div>
                <footer style="text-align: center;">
                    <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                    <p>Sanatorio UTN</p>
                </footer>
            </div>`;

      // Llamar a la función para mandar el correo
      console.log('📧 FRONTEND - appointmentConfirmation: Enviando email de confirmación');
      sendEmailFunction({
        to: userEmail, // Asegúrate de pasar el destinatario como tal
        subject: 'Turno Creado',
        html: cuerpo,
      });
      console.log('✅ FRONTEND - appointmentConfirmation: Email enviado exitosamente');
    }
  }, [turnoCreado, userEmail, dateAndTime, doctorName, doctorLastName, specialtyName, venueName, venueAddress, sendEmailFunction]); // Este efecto se ejecuta solo cuando `userEmail` y `turnoCreado` están listos

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
          <strong>Sede:</strong> {venueName}, {venueAddress}
        </p>
        <p className="text-gray-700">
          <strong>Estado:</strong> Pendiente
        </p>

        {/* Aviso sobre el correo electrónico */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Si no recibiste el correo de confirmación, por favor verifica tu
          dirección de correo en la sección de <strong>Datos Personales</strong>{' '}
          y asegúrate de que sea correcta.
        </p>
      </div>

      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => navigate('/patient')}
      >
        Volver
      </button>
    </div>
  );
}



