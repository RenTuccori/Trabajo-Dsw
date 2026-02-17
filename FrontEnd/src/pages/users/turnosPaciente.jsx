import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePacientes } from '../../context/paciente/PacientesProvider.jsx';

export function TurnosPaciente() {
  const navigate = useNavigate();
  const {
    fetchPatientAppointments,
    confirmAppointmentAction,
    cancelAppointmentAction,
    appointments,
    sendEmailAction,
    userEmail,
    fetchUserByDni,
  } = usePacientes();

  useEffect(() => {
    fetchUserByDni();
    fetchPatientAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirmarTurno = async (turno) => {
    const result = await window.confirmDialog(
      'Confirmar Turno',
      '¿Estás seguro que deseas confirmar este turno?'
    );

    if (result.isConfirmed) {
      try {
        await confirmAppointmentAction({ idTurno: turno.idTurno });
        window.notifySuccess('¡Turno confirmado con éxito!'); // Success message
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                    <h1 style="color: #1c4e80; text-align: center;">¡Tu turno ha sido confirmado con éxito!</h1>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                        <p><strong>Sede:</strong> ${turno.location}</p>
                        <p><strong>Dirección:</strong> ${turno.address}</p>
                        <p><strong>Especialidad:</strong> ${
                          turno.specialty
                        }</p>
                        <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                          turno.fecha_hora
                        )}</p>
                        <p><strong>Doctor:</strong> ${turno.doctor}</p>
                        <p><strong>DNI Paciente:</strong> ${turno.dni}</p>
                    </div>
                    <footer style="text-align: center; margin-top: 20px;">
                        <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                        <p>Sanatorio UTN</p>
                    </footer>
                    </div>
                    `;

        // Call the function to send the email
        sendEmailAction({
          to: userEmail, // Make sure to pass the recipient
          subject: 'Turno Confirmado',
          html: cuerpo,
        });
      } catch (error) {
        window.notifyError('Error al confirmar el turno'); // Error message
      }
    }
  };

  const handleCancelarTurno = async (turno) => {
    const result = await window.confirmDialog(
      'Cancelar Turno',
      '¿Estás seguro que deseas cancelar este turno?'
    );

    if (result.isConfirmed) {
      try {
        await cancelAppointmentAction({ idTurno: turno.idTurno });
        window.notifySuccess('¡Turno cancelado con éxito!'); // Success message
        const cuerpo = `<div style="background-color: #f0f4f8; padding: 20px; border-radius: 10px; font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
                <h1 style="color: #1c4e80; text-align: center;">¡Tu turno ha sido cancelado con éxito!</h1>
                <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-top: 20px;">
                    <p><strong>Sede:</strong> ${turno.location}</p>
                    <p><strong>Dirección:</strong> ${turno.address}</p>
                    <p><strong>Especialidad:</strong> ${turno.specialty}</p>
                    <p><strong>Fecha y Hora:</strong> ${formatFechaHora(
                      turno.fecha_hora
                    )}</p>
                    <p><strong>Doctor:</strong> ${turno.doctor}</p>
                    <p><strong>DNI Paciente:</strong> ${turno.dni}</p>
                </div>
                <footer style="text-align: center; margin-top: 20px;">
                    <p>Nos vemos pronto, ¡gracias por confiar en nosotros!</p>
                    <p>Sanatorio UTN</p>
                </footer>
                </div>
                `;

        // Call the function to send the email
        sendEmailAction({
          to: userEmail, // Make sure to pass the recipient
          subject: 'Turno Cancelado',
          html: cuerpo,
        });
      } catch (error) {
        window.notifyError('Error al cancelar el turno'); // Error message
      }
    }
  };

  const formatFechaHora = (fechaHora) => {
    const date = new Date(fechaHora);
    const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit' };

    const fecha = date.toLocaleDateString('es-ES', opcionesFecha);
    const hora = date.toLocaleTimeString('es-ES', opcionesHora);

    return `${fecha} a las ${hora}`; // Returns date and time in a single string
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6 space-y-4">
        <button
          onClick={() => navigate('/paciente')}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Volver
        </button>
        {appointments && appointments.length > 0 ? (
          appointments.map((turno, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 shadow-sm mb-4"
            >
              <p>
                <strong>Sede:</strong> {turno.location}
              </p>
              <p>
                <strong>Dirección:</strong> {turno.address}
              </p>
              <p>
                <strong>Especialidad:</strong> {turno.specialty}
              </p>
              <p>
                <strong>Fecha y Hora:</strong>{' '}
                {formatFechaHora(turno.fecha_hora)}
              </p>
              <p>
                <strong>Doctor:</strong> {turno.doctor}
              </p>
              <p>
                <strong>DNI Paciente:</strong> {turno.dni}
              </p>
              <p>
                <strong>Estado:</strong> {turno.estado}
              </p>
              <div className="flex space-x-2 mt-4">
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  onClick={() => handleConfirmarTurno(turno)}
                  disabled={
                    turno.estado === 'Confirmado' ||
                    turno.estado === 'Cancelado'
                  }
                >
                  Confirmar
                </button>
                <button
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  onClick={() => handleCancelarTurno(turno)}
                  disabled={
                    turno.estado === 'Cancelado' ||
                    turno.estado === 'Confirmado'
                  }
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No hay turnos para mostrar
          </p>
        )}
      </div>
    </div>
  );
}
