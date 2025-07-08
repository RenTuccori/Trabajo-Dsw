import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../context/patients/PatientsProvider.jsx';

export function PatientAppointments() {
  const navigate = useNavigate();
  const {
    getPatientAppointments,
    confirmAppointment,
    cancelAppointment,
    appointments,
    sendEmail,
    userEmail,
    getUserByDniFunction,
  } = usePacientes();

  useEffect(() => {
    getUserByDniFunction();
    getPatientAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmarTurno = async (appointment) => {
    const result = await window.confirmDialog(
      'Confirmar Turno',
      '¿Estás seguro que deseas confirmar este appointment?'
    );

    if (result.isConfirmed) {
      try {
        await confirmAppointment({ appointmentId: appointment.appointmentId });
        window.notifySuccess('¡Turno confirmado con éxito!'); // Mensaje de éxito
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h1 style="color: #1c4e80; text-align: center;">¡Tu appointment ha sido confirmado con éxito!</h1>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <p><strong>Sede:</strong> ${appointment.Sede}</p>
                        <p><strong>Dirección:</strong> ${appointment.Direccion}</p>
                        <p><strong>Especialidad:</strong> ${
                          appointment.Especialidad
                        }</p>
                        <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                          appointment.dateAndTime
                        )}</p>
                        <p><strong>Doctor:</strong> ${appointment.Doctor}</p>
                        <p><strong>DNI Paciente:</strong> ${appointment.dni}</p>
                    </div>
                    <footer style="text-align: center; margin-top: 20px;">
                        <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                        <p>Sanatorio UTN</p>
                    </footer>
                    </div>
                    `;

        // Llamar a la función para mandar el correo
        sendEmail({
          to: userEmail, // Asegúrate de pasar el destinatario como tal
          subject: 'Turno Confirmado',
          html: cuerpo,
        });
      } catch (error) {
        window.notifyError('Error al confirmar el appointment'); // Mensaje de error
        console.error('Error al confirmar appointment:', error);
      }
    }
  };

  const handleCancelarTurno = async (appointment) => {
    const result = await window.confirmDialog(
      'Cancelar Turno',
      '¿Estás seguro que deseas cancelar este appointment?'
    );

    if (result.isConfirmed) {
      try {
        await cancelAppointment({ appointmentId: appointment.appointmentId });
        window.notifySuccess('¡Turno cancelado con éxito!'); // Mensaje de éxito
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #1c4e80; text-align: center;">¡Tu appointment ha sido cancelado con éxito!</h1>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Sede:</strong> ${appointment.Sede}</p>
                    <p><strong>Dirección:</strong> ${appointment.Direccion}</p>
                    <p><strong>Especialidad:</strong> ${appointment.Especialidad}</p>
                    <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                      appointment.dateAndTime
                    )}</p>
                    <p><strong>Doctor:</strong> ${appointment.Doctor}</p>
                    <p><strong>DNI Paciente:</strong> ${appointment.dni}</p>
                </div>
                <footer style="text-align: center; margin-top: 20px;">
                    <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                    <p>Sanatorio UTN</p>
                </footer>
                </div>
                `;

        // Llamar a la función para mandar el correo
        sendEmail({
          to: userEmail, // Asegúrate de pasar el destinatario como tal
          subject: 'Turno Cancelado',
          html: cuerpo,
        });
      } catch (error) {
        window.notifyError('Error al cancelar el appointment'); // Mensaje de error
        console.error('Error al cancelar appointment:', error);
      }
    }
  };

  const formatFechaHora = (fechaHora) => {
    const date = new Date(fechaHora);
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit' };

    const fecha = date.toLocaleDateString('es-ES', opcionesFecha);
    const hora = date.toLocaleTimeString('es-ES', opcionesHora);

    return `${fecha} a las ${hora}`; // Retorna la fecha y hora en un solo string
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <button
          onClick={() => navigate('/patient')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver
        </button>
        {appointments && appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4"
            >
              <p>
                <strong>Sede:</strong> {appointment.Sede}
              </p>
              <p>
                <strong>Dirección:</strong> {appointment.Direccion}
              </p>
              <p>
                <strong>Especialidad:</strong> {appointment.Especialidad}
              </p>
              <p>
                <strong>Fecha y Hora:</strong>{' '}
                {formatFechaHora(appointment.dateAndTime)}
              </p>
              <p>
                <strong>Doctor:</strong> {appointment.Doctor}
              </p>
              <p>
                <strong>DNI Paciente:</strong> {appointment.dni}
              </p>
              <p>
                <strong>Estado:</strong> {appointment.status}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  onClick={() => handleConfirmarTurno(appointment)}
                  disabled={
                    appointment.status === 'Confirmado' ||
                    appointment.status === 'Cancelado'
                  }
                >
                  Confirmar
                </button>
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={() => handleCancelarTurno(appointment)}
                  disabled={
                    appointment.status === 'Cancelado' ||
                    appointment.status === 'Confirmado'
                  }
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No hay appointments para mostrar
          </p>
        )}
      </div>
    </div>
  );
}



